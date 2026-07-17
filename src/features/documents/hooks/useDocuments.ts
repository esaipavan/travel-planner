import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { getTrips } from '@/features/trips/services/trips.service';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadDocumentFile,
  deleteDocumentFile,
} from '../services/documents.service';
import type {
  TravelDocumentRow,
  TravelDocumentInsert,
  TravelDocumentUpdate,
  DocumentFormValues,
  DocumentType,
} from '../types';

const DOCS_KEY  = (uid: string) => ['documents', uid] as const;
const TRIPS_KEY = (uid: string) => ['trips', uid] as const;

// ── Queries ───────────────────────────────────────────────────────────────────

export function useDocuments() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: DOCS_KEY(user?.id ?? ''),
    queryFn:  () => getDocuments(user!.id),
    enabled:  !!user,
    staleTime: 5 * 60_000,
  });
}

export function useUserTrips() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: TRIPS_KEY(user?.id ?? ''),
    queryFn:  () => getTrips(user!.id),
    enabled:  !!user,
    staleTime: 10 * 60_000,
    select:   (rows) => rows.map((t) => ({ id: t.id, title: t.title, destination: t.destination })),
  });
}

// ── Upload (create) ───────────────────────────────────────────────────────────

export function useUploadDocument() {
  const qc       = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ values, file }: { values: DocumentFormValues; file: File }) => {
      if (!user) throw new Error('Not authenticated');

      const docId  = crypto.randomUUID();
      const fileUrl = await uploadDocumentFile(user.id, docId, file);

      const insert: TravelDocumentInsert = {
        id:          docId,
        user_id:     user.id,
        type:        values.type as DocumentType,
        name:        values.name,
        trip_id:     values.trip_id || null,
        country:     values.country || null,
        expiry_date: values.expiry_date || null,
        notes:       values.notes || null,
        file_url:    fileUrl,
        file_size:   file.size,
      };

      return createDocument(insert);
    },
    onSuccess: () => {
      if (user) void qc.invalidateQueries({ queryKey: DOCS_KEY(user.id) });
      toast.success('Document uploaded');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Update (rename / metadata) ────────────────────────────────────────────────

export function useUpdateDocument() {
  const qc       = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: DocumentFormValues }) => {
      const update: TravelDocumentUpdate = {
        type:        values.type as DocumentType,
        name:        values.name,
        trip_id:     values.trip_id || null,
        country:     values.country || null,
        expiry_date: values.expiry_date || null,
        notes:       values.notes || null,
      };
      return updateDocument(id, update);
    },
    onSuccess: () => {
      if (user) void qc.invalidateQueries({ queryKey: DOCS_KEY(user.id) });
      toast.success('Document updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteDocument() {
  const qc       = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ id, fileUrl }: { id: string; fileUrl: string }) => {
      await deleteDocumentFile(fileUrl);
      await deleteDocument(id);
    },
    onMutate: async ({ id }) => {
      if (!user) return;
      const key = DOCS_KEY(user.id);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<TravelDocumentRow[]>(key);
      qc.setQueryData<TravelDocumentRow[]>(key, (old) =>
        old?.filter((d) => d.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (user && ctx?.previous) {
        qc.setQueryData(DOCS_KEY(user.id), ctx.previous);
      }
      toast.error('Failed to delete document');
    },
    onSettled: () => {
      if (user) void qc.invalidateQueries({ queryKey: DOCS_KEY(user.id) });
    },
    onSuccess: () => toast.success('Document deleted'),
  });
}
