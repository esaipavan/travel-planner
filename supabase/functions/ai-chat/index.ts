import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { AIRequestBody, AIResponse, IAIProvider } from './types.ts';
import { GroqProvider } from './providers/groq.ts';
import { GeminiProvider } from './providers/gemini.ts';
import { OpenRouterProvider } from './providers/openrouter.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI travel assistant for TravelPlanner.
Help users plan trips, estimate budgets, suggest activities, pack efficiently, and navigate destinations.
Be concise, practical, and enthusiastic about travel. Format responses with markdown when helpful.
When given trip context, personalise your suggestions to the specific destination, dates, and budget.`;

function getProvider(): IAIProvider {
  const providerName = Deno.env.get('AI_PROVIDER') ?? 'groq';

  switch (providerName) {
    case 'gemini':     return new GeminiProvider();
    case 'openrouter': return new OpenRouterProvider();
    case 'groq':
    default:           return new GroqProvider();
  }
}

async function tryProviders(
  messages: AIRequestBody['messages'],
  systemPrompt: string,
): Promise<{ result: Awaited<ReturnType<IAIProvider['chat']>>; provider: IAIProvider }> {
  // Fallback chain: primary → gemini → openrouter
  const chain: (() => IAIProvider)[] = [
    getProvider,
    () => new GeminiProvider(),
    () => new OpenRouterProvider(),
  ];

  let lastError: Error | null = null;

  for (const makeProvider of chain) {
    try {
      const provider = makeProvider();
      const result = await provider.chat(messages, systemPrompt);
      return { result, provider };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`Provider failed, trying next: ${lastError.message}`);
    }
  }

  throw lastError ?? new Error('All AI providers failed');
}

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  const startTime = Date.now();
  let userId: string | null = null;
  let provider: IAIProvider | null = null;
  let success = false;
  let errorMessage: string | null = null;
  let tokensUsed: number | undefined;

  try {
    // Verify Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;

    // Parse body
    const body = await req.json() as AIRequestBody;
    const { messages, options } = body;

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Build system prompt
    let systemPrompt = options?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
    if (options?.tripContext) {
      const ctx = options.tripContext;
      systemPrompt += `\n\nTrip context:\n- Destination: ${ctx.destination}\n- Dates: ${ctx.startDate} to ${ctx.endDate}${ctx.budget ? `\n- Budget: ${ctx.currency ?? 'INR'} ${ctx.budget}` : ''}`;
    }

    // Call AI with fallback chain
    const { result, provider: usedProvider } = await tryProviders(messages, systemPrompt);
    provider = usedProvider;
    tokensUsed = result.tokensUsed;
    success = true;

    const responseBody: AIResponse = {
      content: result.content,
      provider: usedProvider.name,
      model: usedProvider.model,
      tokensUsed: result.tokensUsed,
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
    console.error('AI chat error:', errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } finally {
    // Log usage (best-effort, uses service role to bypass RLS)
    try {
      const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      await serviceClient.from('ai_usage_logs').insert({
        user_id: userId,
        provider: provider?.name ?? 'unknown',
        model: provider?.model ?? 'unknown',
        prompt_tokens: null,
        completion_tokens: null,
        latency_ms: Date.now() - startTime,
        success,
        error_message: errorMessage,
      });
    } catch {
      // Non-fatal — don't fail the request over logging
    }
  }
});
