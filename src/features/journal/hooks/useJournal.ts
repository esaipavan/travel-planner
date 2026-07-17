import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  uploadJournalImage,
  deleteJournalImages,
} from '../services/journal.service';
import type { JournalEntryRow, JournalEntryInsert, JournalEntryUpdate, JournalFormValues, MoodEnum } from '../types';

const KEY = (tripId: string) => ['journal', tripId] as const;

// ── Read ──────────────────────────────────────────────────────────────────────

export function useJournalEntries(tripId: string) {
  return useQuery({
    queryKey: KEY(tripId),
    queryFn:  () => getJournalEntries(tripId),
    enabled:  !!tripId,
    staleTime: 5 * 60_000,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────

export function useCreateJournalEntry(tripId: string) {
  const qc   = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      values,
      newImages,
    }: {
      values: JournalFormValues;
      newImages: File[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const entryId   = crypto.randomUUID();
      const imageUrls = newImages.length
        ? await Promise.all(newImages.map((f) => uploadJournalImage(user.id, entryId, f)))
        : [];

      const insert: JournalEntryInsert = {
        id:            entryId,
        trip_id:       tripId,
        user_id:       user.id,
        title:         values.title || null,
        content:       values.content || null,
        date:          values.date,
        location_name: values.location_name || null,
        mood:          (values.mood as MoodEnum) || null,
        rating:        values.rating,
        is_favourite:  values.is_favourite,
        is_public:     values.is_public,
        image_urls:    imageUrls.length ? imageUrls : null,
      };

      return createJournalEntry(insert);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEY(tripId) });
      toast.success('Journal entry created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateJournalEntry(tripId: string) {
  const qc       = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      id,
      values,
      existingUrls,
      newImages,
      removedUrls,
    }: {
      id:           string;
      values:       JournalFormValues;
      existingUrls: string[];
      newImages:    File[];
      removedUrls:  string[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const [newUrls] = await Promise.all([
        newImages.length
          ? Promise.all(newImages.map((f) => uploadJournalImage(user.id, id, f)))
          : Promise.resolve([] as string[]),
        removedUrls.length ? deleteJournalImages(removedUrls) : Promise.resolve(),
      ]);

      const kept   = existingUrls.filter((u) => !removedUrls.includes(u));
      const allUrls = [...kept, ...newUrls];

      const update: JournalEntryUpdate = {
        title:         values.title || null,
        content:       values.content || null,
        date:          values.date,
        location_name: values.location_name || null,
        mood:          (values.mood as MoodEnum) || null,
        rating:        values.rating,
        is_favourite:  values.is_favourite,
        is_public:     values.is_public,
        image_urls:    allUrls.length ? allUrls : null,
      };

      return updateJournalEntry(id, update);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEY(tripId) });
      toast.success('Entry updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteJournalEntry(tripId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imageUrls }: { id: string; imageUrls: string[] }) => {
      await deleteJournalImages(imageUrls);
      await deleteJournalEntry(id);
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: KEY(tripId) });
      const previous = qc.getQueryData<JournalEntryRow[]>(KEY(tripId));
      qc.setQueryData<JournalEntryRow[]>(KEY(tripId), (old) =>
        old?.filter((e) => e.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(KEY(tripId), ctx.previous);
      toast.error('Failed to delete entry');
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: KEY(tripId) }),
    onSuccess: () => toast.success('Entry deleted'),
  });
}

// ── Toggle favourite ──────────────────────────────────────────────────────────

export function useToggleFavourite(tripId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavourite }: { id: string; isFavourite: boolean }) =>
      updateJournalEntry(id, { is_favourite: isFavourite }),
    onMutate: async ({ id, isFavourite }) => {
      await qc.cancelQueries({ queryKey: KEY(tripId) });
      const previous = qc.getQueryData<JournalEntryRow[]>(KEY(tripId));
      qc.setQueryData<JournalEntryRow[]>(KEY(tripId), (old) =>
        old?.map((e) => (e.id === id ? { ...e, is_favourite: isFavourite } : e)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(KEY(tripId), ctx.previous);
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: KEY(tripId) }),
  });
}
