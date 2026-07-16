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
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface AIStreamChunk {
  delta: string;
  done: boolean;
}
