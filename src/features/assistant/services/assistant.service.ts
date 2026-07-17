import { supabase } from '@/lib/supabase';
import type { ChatMessage, TripContext } from '../types';

interface EdgeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface EdgeResponse {
  content?: string;
  error?: string;
}

export async function callAIAssistant(
  messages: ChatMessage[],
  tripContext?: TripContext,
): Promise<string> {
  const apiMessages: EdgeMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: {
      messages: apiMessages,
      options: tripContext
        ? {
            tripContext: {
              tripId:      tripContext.tripId,
              destination: tripContext.destination,
              startDate:   tripContext.startDate,
              endDate:     tripContext.endDate,
              budget:      tripContext.budget,
              currency:    tripContext.currency,
            },
          }
        : undefined,
    },
  });

  if (error) throw new Error((error as { message?: string }).message ?? 'AI service unavailable');

  const result = data as EdgeResponse;
  if (result.error) throw new Error(result.error);
  if (!result.content) throw new Error('Empty response from AI service');

  return result.content;
}
