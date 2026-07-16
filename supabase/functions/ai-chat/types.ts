export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequestOptions {
  systemPrompt?: string;
  tripContext?: {
    tripId: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget?: number;
    currency?: string;
  };
  stream?: boolean;
}

export interface AIRequestBody {
  messages: AIMessage[];
  options?: AIRequestOptions;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface IAIProvider {
  chat(messages: AIMessage[], systemPrompt?: string): Promise<{ content: string; tokensUsed?: number }>;
  readonly name: string;
  readonly model: string;
}
