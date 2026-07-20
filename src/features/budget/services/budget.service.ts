import { supabase } from '@/lib/supabase';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import type { CategoryBudgetItem, BudgetSummary, ExpenseCategory } from '../types';

export interface BudgetData {
  items: CategoryBudgetItem[];
  summary: BudgetSummary;
  tripStartDate: string;
  tripEndDate: string;
}

export async function getBudgetData(tripId: string): Promise<BudgetData> {
  const [
    { data: tripData, error: tripError },
    { data: budgetRows, error: budgetError },
    { data: expenseRows, error: expenseError },
  ] = await Promise.all([
    supabase
      .from('trips')
      .select('title, total_budget, currency, start_date, end_date')
      .eq('id', tripId)
      .single(),
    supabase
      .from('trip_budgets')
      .select('category, allocated_amount, currency')
      .eq('trip_id', tripId),
    supabase
      .from('expenses')
      .select('category, amount')
      .eq('trip_id', tripId),
  ]);

  if (tripError) throw new Error(tripError.message);
  if (budgetError) throw new Error(budgetError.message);
  if (expenseError) throw new Error(expenseError.message);

  const tripCurrency = tripData?.currency ?? 'INR';
  const tripBudget = tripData?.total_budget ?? null;
  const tripTitle = tripData?.title ?? '';

  const allocatedMap = new Map<string, number>();
  for (const row of budgetRows ?? []) {
    allocatedMap.set(row.category, row.allocated_amount);
  }

  const spentMap = new Map<string, number>();
  for (const row of expenseRows ?? []) {
    spentMap.set(row.category, (spentMap.get(row.category) ?? 0) + row.amount);
  }

  const items: CategoryBudgetItem[] = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat.value,
    label: cat.label,
    emoji: cat.emoji,
    allocated: allocatedMap.get(cat.value) ?? 0,
    spent: spentMap.get(cat.value) ?? 0,
    currency: tripCurrency,
  }));

  const totalAllocated = items.reduce((s, i) => s + i.allocated, 0);
  const totalSpent = items.reduce((s, i) => s + i.spent, 0);
  const unallocated = tripBudget != null ? tripBudget - totalAllocated : 0;
  const remaining = tripBudget != null ? tripBudget - totalSpent : totalAllocated - totalSpent;

  return {
    items,
    summary: { tripBudget, tripCurrency, tripTitle, totalAllocated, totalSpent, unallocated, remaining },
    tripStartDate: tripData?.start_date ?? '',
    tripEndDate: tripData?.end_date ?? '',
  };
}

export async function batchUpsertCategoryBudgets(
  tripId: string,
  allocations: Partial<Record<ExpenseCategory, number>>,
  currency: string,
): Promise<void> {
  const entries = (Object.entries(allocations) as [ExpenseCategory, number | undefined][]).filter(
    ([, amount]) => (amount ?? 0) > 0,
  );
  if (entries.length === 0) return;

  const results = await Promise.all(
    entries.map(([cat, amount]) =>
      supabase
        .from('trip_budgets')
        .upsert(
          { trip_id: tripId, category: cat, allocated_amount: amount!, currency },
          { onConflict: 'trip_id,category' },
        ),
    ),
  );
  const firstError = results.find((r) => r.error)?.error;
  if (firstError) throw new Error(firstError.message);
}

export async function upsertCategoryBudget(
  tripId: string,
  category: ExpenseCategory,
  allocatedAmount: number,
  currency: string,
): Promise<void> {
  const { error } = await supabase
    .from('trip_budgets')
    .upsert(
      { trip_id: tripId, category, allocated_amount: allocatedAmount, currency },
      { onConflict: 'trip_id,category' },
    );
  if (error) throw new Error(error.message);
}

export async function deleteCategoryBudget(
  tripId: string,
  category: ExpenseCategory,
): Promise<void> {
  const { error } = await supabase
    .from('trip_budgets')
    .delete()
    .eq('trip_id', tripId)
    .eq('category', category);
  if (error) throw new Error(error.message);
}
