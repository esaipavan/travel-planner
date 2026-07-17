import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Trash2, Bot, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAssistant } from '../hooks/useAssistant';
import type { TripContext } from '../types';
import { ChatMessageBubble } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { QuickPrompts } from '../components/QuickPrompts';

const FALLBACK_CHIPS = [
  { label: 'Best time to visit', prompt: 'When is the best time to visit?' },
  { label: 'Budget tips',        prompt: 'Give me some budget travel tips' },
  { label: 'Packing essentials', prompt: 'What should I pack for my trip?' },
];

function buildTripChips(dest: string) {
  return [
    { label: 'More activities', prompt: `What other activities can I do in ${dest}?` },
    { label: 'Local food',      prompt: `What are the must-try foods in ${dest}?` },
    { label: 'Safety tips',     prompt: `What safety tips should I know for ${dest}?` },
  ];
}

function InlineSuggestions({
  tripContext,
  onSelect,
}: {
  tripContext?: TripContext;
  onSelect: (p: string) => void;
}) {
  const chips = tripContext ? buildTripChips(tripContext.destination) : FALLBACK_CHIPS;
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {chips.map(({ label, prompt }) => (
        <button
          key={label}
          onClick={() => onSelect(prompt)}
          className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function AssistantPage() {
  const [searchParams]            = useSearchParams();
  const tripId                    = searchParams.get('tripId') ?? undefined;
  const [input, setInput]         = useState('');
  const messagesEndRef            = useRef<HTMLDivElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  const { messages, isPending, send, clearChat, trip, tripContext } = useAssistant(tripId);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isPending) return;
    setInput('');
    await send(text);
    textareaRef.current?.focus();
  }, [input, isPending, send]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      void send(prompt);
    },
    [send],
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-0">
      {/* Header */}
      <div className="flex-none pb-4">
        <div className="flex items-start justify-between">
          <PageHeader
            title="AI Travel Assistant"
            description="Your personal travel expert — ask anything about destinations, itineraries, or your trips"
          />
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 shrink-0 text-muted-foreground"
              onClick={clearChat}
              title="Clear conversation"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>

        {/* Trip context banner */}
        {trip && (
          <div className="mt-3 flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium">{trip.destination}</span>
            <span className="text-muted-foreground">·</span>
            <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
            </span>
            {trip.total_budget != null && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {trip.currency} {trip.total_budget.toLocaleString()}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty && !isPending ? (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center gap-6 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-semibold">Ask me anything about travel</p>
                <p className="text-sm text-muted-foreground">
                  I can help with itineraries, budgets, packing, local tips, and more.
                </p>
              </div>
              <QuickPrompts tripContext={tripContext} onSelect={handleQuickPrompt} />
            </div>
          ) : (
            /* Messages list */
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              {isPending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-none border-t bg-card p-3">
          {/* Inline suggestion chips shown after first message */}
          {!isEmpty && !isPending && (
            <InlineSuggestions tripContext={tripContext} onSelect={handleQuickPrompt} />
          )}

          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me about destinations, itineraries, budgets, packing…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[40px] max-h-32 resize-none"
              disabled={isPending}
            />
            <Button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isPending}
              size="icon"
              className="h-10 w-10 shrink-0 self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
