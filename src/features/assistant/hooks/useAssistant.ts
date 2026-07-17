import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTripById } from '@/features/trips/services/trips.service';
import { callAIAssistant } from '../services/assistant.service';
import type { ChatMessage, TripContext } from '../types';

export function useAssistant(tripId?: string) {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);

  // Ref tracks ground-truth array so async callbacks never see stale closures
  const messagesRef = useRef<ChatMessage[]>([]);

  const { data: trip, isLoading: isTripLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn:  () => getTripById(tripId!),
    enabled:  !!tripId,
    staleTime: 5 * 60_000,
  });

  const tripContext: TripContext | undefined = trip
    ? {
        tripId:      trip.id,
        destination: trip.destination,
        startDate:   trip.start_date,
        endDate:     trip.end_date,
        budget:      trip.total_budget ?? undefined,
        currency:    trip.currency,
      }
    : undefined;

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isPending) return;

      const userMsg: ChatMessage = {
        id:        crypto.randomUUID(),
        role:      'user',
        content:   content.trim(),
        timestamp: new Date(),
      };

      const updated = [...messagesRef.current, userMsg];
      messagesRef.current = updated;
      setMessages(updated);
      setIsPending(true);

      try {
        const responseContent = await callAIAssistant(updated, tripContext);
        const assistantMsg: ChatMessage = {
          id:        crypto.randomUUID(),
          role:      'assistant',
          content:   responseContent,
          timestamp: new Date(),
        };
        const withReply = [...messagesRef.current, assistantMsg];
        messagesRef.current = withReply;
        setMessages(withReply);
      } catch (err) {
        const errMsg: ChatMessage = {
          id:        crypto.randomUUID(),
          role:      'assistant',
          content:   `Sorry, I encountered an error: ${
            err instanceof Error ? err.message : 'Please try again.'
          }`,
          timestamp: new Date(),
        };
        const withErr = [...messagesRef.current, errMsg];
        messagesRef.current = withErr;
        setMessages(withErr);
      } finally {
        setIsPending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPending, tripContext],
  );

  const clearChat = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
  }, []);

  return { messages, isPending, send, clearChat, trip, tripContext, isTripLoading };
}
