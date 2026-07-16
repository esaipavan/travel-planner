import { supabase } from '@/lib/supabase';
import type { AIMessage, AIRequestOptions, AIResponse } from './ai.types';

/** Single public function the entire app uses for AI — never calls a provider directly. */
export async function chatWithAI(
  messages: AIMessage[],
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const { data, error } = await supabase.functions.invoke<AIResponse>('ai-chat', {
    body: { messages, options },
  });

  if (error) throw new Error(`AI request failed: ${error.message}`);
  if (!data) throw new Error('No response from AI service');

  return data;
}

export async function streamChatWithAI(
  messages: AIMessage[],
  options: AIRequestOptions | undefined,
  _onChunk: (chunk: string) => void,
  onDone: (response: AIResponse) => void,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke<AIResponse>('ai-chat', {
    body: { messages, options, stream: true },
  });

  if (error) throw new Error(`AI stream failed: ${error.message}`);
  if (!data) throw new Error('No response from AI stream');

  onDone(data);
}
