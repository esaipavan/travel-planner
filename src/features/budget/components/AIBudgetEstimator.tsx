import { useState } from 'react';
import { Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import { useBatchUpsertBudgets } from '../hooks/useBudget';
import {
  getAIBudgetEstimate,
  BUDGET_STYLES,
  type AIBudgetEstimate,
  type BudgetStyleValue,
} from '../services/budget.ai.service';
import type { ExpenseCategory } from '../types';

interface Props {
  tripId: string;
  destination: string;
  days: number;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIBudgetEstimator({ tripId, destination, days, currency, open, onOpenChange }: Props) {
  const [style, setStyle] = useState<BudgetStyleValue>('comfort');
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<AIBudgetEstimate | null>(null);
  const [overrides, setOverrides] = useState<Partial<Record<ExpenseCategory, string>>>({});

  const { mutateAsync: batchUpsert, isPending: isApplying } = useBatchUpsertBudgets(tripId);

  async function handleGenerate() {
    setIsLoading(true);
    setEstimate(null);
    setOverrides({});
    try {
      const result = await getAIBudgetEstimate(destination, days, style, currency);
      setEstimate(result);
      const initial: Partial<Record<ExpenseCategory, string>> = {};
      for (const [cat, amt] of Object.entries(result.allocations)) {
        initial[cat as ExpenseCategory] = String(amt);
      }
      setOverrides(initial);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI estimation failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApply() {
    const allocations: Partial<Record<ExpenseCategory, number>> = {};
    for (const [cat, val] of Object.entries(overrides)) {
      const n = Number(val);
      if (!isNaN(n) && n > 0) allocations[cat as ExpenseCategory] = n;
    }
    if (Object.keys(allocations).length === 0) {
      toast.error('No valid amounts to apply.');
      return;
    }
    try {
      await batchUpsert({ allocations, currency });
      toast.success('AI budget applied to all categories');
      onOpenChange(false);
      setEstimate(null);
      setOverrides({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply budget');
    }
  }

  function handleClose(open: boolean) {
    if (!open) {
      setEstimate(null);
      setOverrides({});
    }
    onOpenChange(open);
  }

  const fmt = (n: number) => formatCurrency(n, currency);
  const activeCategories = EXPENSE_CATEGORIES.filter((c) => estimate?.allocations[c.value]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Budget Estimate
          </DialogTitle>
          <DialogDescription>
            Get an AI-powered budget estimate for {destination} ({days} day{days !== 1 ? 's' : ''})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Style picker */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Travel style
            </p>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyle(s.value)}
                  className={`rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    style === s.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'bg-card hover:border-primary/40'
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <p className="mt-1 text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {!estimate && (
            <Button
              className="w-full gap-2"
              onClick={() => void handleGenerate()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating estimate…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Estimate
                </>
              )}
            </Button>
          )}

          {/* Results */}
          {estimate && (
            <div className="space-y-3">
              {estimate.notes && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-muted-foreground">
                  💡 {estimate.notes}
                </div>
              )}

              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Suggested allocations — edit before applying
              </p>

              <div className="max-h-64 overflow-y-auto space-y-2 rounded-lg border p-3">
                {activeCategories.map((cat) => (
                  <div key={cat.value} className="flex items-center gap-3">
                    <span className="w-5 text-center text-base" role="img" aria-label={cat.label}>
                      {cat.emoji}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium">{cat.label}</span>
                    <div className="relative w-32">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={overrides[cat.value] ?? ''}
                        onChange={(e) =>
                          setOverrides((prev) => ({ ...prev, [cat.value]: e.target.value }))
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-right text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">Total estimate</span>
                <span className="font-semibold tabular-nums">{fmt(estimate.totalEstimate)}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => void handleGenerate()}
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          {estimate && (
            <Button onClick={() => void handleApply()} disabled={isApplying} className="gap-2">
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isApplying ? 'Applying…' : 'Apply to Budget'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
