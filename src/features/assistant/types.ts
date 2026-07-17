export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TripContext {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  currency?: string;
}
