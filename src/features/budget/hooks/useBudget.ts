import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBudgetData, upsertCategoryBudget, deleteCategoryBudget } from '../services/budget.service';
import type { ExpenseCategory } from '../types';

export function useBudget(tripId: string) {
  return useQuery({
    queryKey: ['budget', tripId],
    queryFn: () => getBudgetData(tripId),
    enabled: !!tripId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertCategoryBudget(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      category,
      allocatedAmount,
      currency,
    }: {
      category: ExpenseCategory;
      allocatedAmount: number;
      currency: string;
    }) => upsertCategoryBudget(tripId, category, allocatedAmount, currency),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budget', tripId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteCategoryBudget(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (category: ExpenseCategory) => deleteCategoryBudget(tripId, category),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budget', tripId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
