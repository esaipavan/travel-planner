import type { Database } from '@/types/database.types';

export type TripBudgetRow = Database['public']['Tables']['trip_budgets']['Row'];
export type ExpenseCategory = Database['public']['Enums']['expense_category'];

export interface CategoryBudgetItem {
  category: ExpenseCategory;
  label: string;
  emoji: string;
  allocated: number;
  spent: number;
  currency: string;
}

export interface BudgetSummary {
  tripBudget: number | null;
  tripCurrency: string;
  tripTitle: string;
  totalAllocated: number;
  totalSpent: number;
  unallocated: number;
  remaining: number;
}

export interface BudgetFormValues {
  allocatedAmount: string;
}
