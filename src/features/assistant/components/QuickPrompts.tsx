import { Button } from '@/components/ui/button';
import type { TripContext } from '../types';

const BASE_PROMPTS = [
  { label: 'Plan my trip',         icon: '🗺️' },
  { label: 'Budget suggestions',   icon: '💰' },
  { label: 'Packing checklist',    icon: '🎒' },
  { label: 'Things to do',         icon: '🎡' },
  { label: 'Best food to try',     icon: '🍜' },
  { label: 'Travel tips',          icon: '✈️' },
] as const;

interface Props {
  tripContext?: TripContext;
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ tripContext, onSelect }: Props) {
  function buildPrompt(label: string): string {
    if (!tripContext) return label;
    const dest = tripContext.destination;
    const map: Record<string, string> = {
      'Plan my trip':         `Create a day-by-day itinerary for my trip to ${dest}`,
      'Budget suggestions':   `What are the best ways to manage my budget in ${dest}?`,
      'Packing checklist':    `Give me a packing checklist for my trip to ${dest}`,
      'Things to do':         `What are the top things to do and see in ${dest}?`,
      'Best food to try':     `What local food and dishes should I try in ${dest}?`,
      'Travel tips':          `What are the most important travel tips for visiting ${dest}?`,
    };
    return map[label] ?? label;
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground">
        {tripContext
          ? `Ask me anything about your trip to ${tripContext.destination}`
          : 'Ask me anything about travel, or try one of these:'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {BASE_PROMPTS.map(({ label, icon }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            className="h-auto gap-1.5 px-3 py-2 text-xs"
            onClick={() => onSelect(buildPrompt(label))}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
