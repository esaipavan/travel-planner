import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Download, FileSpreadsheet, FileText, Printer, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTrip } from '@/features/trips/hooks/useTrips';
import { useBudget } from '@/features/budget/hooks/useBudget';
import { useExpenseData } from '@/features/expenses/hooks/useExpenses';
import { formatDate, formatDateRange, formatCurrency } from '@/utils/formatters';
import type { TripRow } from '@/features/trips/types';
import type { BudgetData } from '@/features/budget/services/budget.service';
import type { ExpenseData, ExpenseRow } from '@/features/expenses/types';

type ExportFormat = 'excel' | 'csv' | 'print';

interface FormatOption {
  value: ExportFormat;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'excel',
    label: 'Excel Workbook',
    description: 'Multi-sheet workbook with trip overview, budget summary, and full expense log',
    icon: FileSpreadsheet,
    badge: 'Recommended',
  },
  {
    value: 'csv',
    label: 'CSV Spreadsheet',
    description: 'Expense list in comma-separated format, compatible with any spreadsheet app',
    icon: FileText,
  },
  {
    value: 'print',
    label: 'Print / PDF',
    description: 'Opens a print-friendly summary — use your browser\'s "Save as PDF" option',
    icon: Printer,
  },
];

function safeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportToCSV(expenses: ExpenseRow[], tripTitle: string): void {
  const headers = ['Date', 'Title', 'Category', 'Amount', 'Currency', 'Payment Method', 'Notes'];
  const rows = expenses.map((e) => [
    e.date,
    e.title,
    e.category,
    e.amount.toString(),
    e.currency,
    e.payment_method,
    e.notes ?? '',
  ]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${safeFilename(tripTitle)}-expenses.csv`);
}

function exportToExcel(trip: TripRow, budgetData: BudgetData, expenseData: ExpenseData): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Overview
  const overviewWs = XLSX.utils.aoa_to_sheet([
    ['TravelPlanner — Trip Export'],
    [],
    ['Trip', trip.title],
    ['Destination', trip.destination],
    ['Dates', formatDateRange(trip.start_date, trip.end_date)],
    ['Status', trip.status],
    ['Total Budget', trip.total_budget ?? 'Not set'],
    ['Currency', trip.currency],
    ['Notes', trip.notes ?? ''],
  ]);
  overviewWs['!cols'] = [{ wch: 16 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(wb, overviewWs, 'Overview');

  // Sheet 2: Budget breakdown
  const activeItems = budgetData.items.filter((i) => i.allocated > 0 || i.spent > 0);
  const budgetWs = XLSX.utils.aoa_to_sheet([
    ['Category', 'Allocated', 'Spent', 'Remaining', '% Used', 'Currency'],
    ...activeItems.map((i) => [
      i.label,
      i.allocated,
      i.spent,
      i.allocated - i.spent,
      i.allocated > 0 ? Math.round((i.spent / i.allocated) * 100) : 0,
      i.currency,
    ]),
    [],
    [
      'TOTAL',
      budgetData.summary.totalAllocated,
      budgetData.summary.totalSpent,
      budgetData.summary.remaining,
      budgetData.summary.totalAllocated > 0
        ? Math.round((budgetData.summary.totalSpent / budgetData.summary.totalAllocated) * 100)
        : 0,
      trip.currency,
    ],
  ]);
  budgetWs['!cols'] = [
    { wch: 20 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, budgetWs, 'Budget');

  // Sheet 3: Expense log
  const expenseWs = XLSX.utils.aoa_to_sheet([
    ['Date', 'Title', 'Category', 'Amount', 'Currency', 'Payment Method', 'Notes'],
    ...expenseData.expenses.map((e) => [
      e.date,
      e.title,
      e.category,
      e.amount,
      e.currency,
      e.payment_method,
      e.notes ?? '',
    ]),
  ]);
  expenseWs['!cols'] = [
    { wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 32 },
  ];
  XLSX.utils.book_append_sheet(wb, expenseWs, 'Expenses');

  XLSX.writeFile(wb, `${safeFilename(trip.title)}-export.xlsx`);
}

function openPrintView(trip: TripRow, budgetData: BudgetData, expenseData: ExpenseData): void {
  const fmt = (n: number) => formatCurrency(n, trip.currency);
  const activeItems = budgetData.items.filter((i) => i.allocated > 0 || i.spent > 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${trip.title} — TravelPlanner Export</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #111; padding: 32px; line-height: 1.5; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #555; margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
    .meta { color: #555; font-size: 13px; margin-bottom: 8px; }
    .badge { display: inline-block; background: #f3f4f6; border-radius: 4px; padding: 2px 8px; font-size: 11px; text-transform: capitalize; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    th { text-align: left; padding: 7px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; background: #f9fafb; border-bottom: 2px solid #e5e7eb; color: #555; }
    td { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .total-row td { font-weight: 700; border-top: 2px solid #e5e7eb; border-bottom: none; }
    .over { color: #dc2626; }
    .good { color: #16a34a; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; }
    @media print { body { padding: 20px; } @page { margin: 20mm; } }
  </style>
</head>
<body>
  <h1>${trip.title}</h1>
  <p class="meta">📍 ${trip.destination} &nbsp;·&nbsp; 📅 ${formatDateRange(trip.start_date, trip.end_date)} &nbsp;·&nbsp; <span class="badge">${trip.status}</span></p>
  ${trip.total_budget ? `<p class="meta">💰 Budget: <strong>${fmt(trip.total_budget)}</strong></p>` : ''}
  ${trip.notes ? `<p class="meta" style="margin-top:8px;">${trip.notes}</p>` : ''}

  ${
    activeItems.length > 0
      ? `<h2>Budget Summary</h2>
  <table>
    <tr><th>Category</th><th class="num">Allocated</th><th class="num">Spent</th><th class="num">Remaining</th></tr>
    ${activeItems
      .map((i) => {
        const rem = i.allocated - i.spent;
        return `<tr>
      <td>${i.emoji} ${i.label}</td>
      <td class="num">${fmt(i.allocated)}</td>
      <td class="num">${fmt(i.spent)}</td>
      <td class="num ${rem < 0 ? 'over' : 'good'}">${rem < 0 ? '−' : ''}${fmt(Math.abs(rem))}</td>
    </tr>`;
      })
      .join('')}
    <tr class="total-row">
      <td>Total</td>
      <td class="num">${fmt(budgetData.summary.totalAllocated)}</td>
      <td class="num">${fmt(budgetData.summary.totalSpent)}</td>
      <td class="num ${budgetData.summary.remaining < 0 ? 'over' : 'good'}">${budgetData.summary.remaining < 0 ? '−' : ''}${fmt(Math.abs(budgetData.summary.remaining))}</td>
    </tr>
  </table>`
      : ''
  }

  ${
    expenseData.expenses.length > 0
      ? `<h2>Expense Log <span style="font-weight:400;color:#9ca3af;">(${expenseData.expenses.length} transactions)</span></h2>
  <table>
    <tr><th>Date</th><th>Description</th><th>Category</th><th>Method</th><th class="num">Amount</th></tr>
    ${expenseData.expenses
      .map(
        (e) => `<tr>
      <td style="white-space:nowrap;">${e.date}</td>
      <td>${e.title}</td>
      <td style="text-transform:capitalize;">${e.category}</td>
      <td style="text-transform:capitalize;">${e.payment_method}</td>
      <td class="num">${fmt(e.amount)}</td>
    </tr>`,
      )
      .join('')}
  </table>`
      : '<p style="color:#9ca3af;margin-top:16px;">No expenses recorded.</p>'
  }

  <div class="footer">Exported from TravelPlanner &nbsp;·&nbsp; ${formatDate(new Date().toISOString().slice(0, 10))}</div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 300));</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function ExportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-10 w-36" />
    </div>
  );
}

export default function ExportPage() {
  const { id: tripId } = useParams<{ id: string }>();
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(tripId!);
  const { data: budgetData, isLoading: budgetLoading } = useBudget(tripId!);
  const { data: expenseData, isLoading: expenseLoading } = useExpenseData(tripId!);
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [isExporting, setIsExporting] = useState(false);

  const isLoading = tripLoading || budgetLoading || expenseLoading;

  if (isLoading) return <ExportSkeleton />;
  if (tripError || !trip || !budgetData || !expenseData) return <Navigate to="/trips" replace />;

  async function handleExport() {
    if (!trip || !budgetData || !expenseData) return;
    setIsExporting(true);
    try {
      if (format === 'csv') {
        exportToCSV(expenseData.expenses, trip.title);
        toast.success('CSV downloaded');
      } else if (format === 'excel') {
        exportToExcel(trip, budgetData, expenseData);
        toast.success('Excel workbook downloaded');
      } else {
        openPrintView(trip, budgetData, expenseData);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }

  const expenseCount = expenseData.expenses.length;
  const activeCategories = budgetData.items.filter((i) => i.allocated > 0 || i.spent > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
          <Link to={`/trips/${tripId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="Export Trip" description={trip.title} />
      </div>

      {/* Format picker */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          Export format
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {FORMAT_OPTIONS.map(({ value, label, description, icon: Icon, badge }) => {
            const selected = format === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFormat(value)}
                className={`relative rounded-lg border p-4 text-left transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card'
                }`}
              >
                {badge && (
                  <span className="absolute right-3 top-3">
                    <Badge variant="secondary" className="text-[10px]">{badge}</Badge>
                  </span>
                )}
                {selected && (
                  <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
                <div className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl ${selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* What's included */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="text-sm font-semibold">What's included</p>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>Trip overview &amp; details</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                Budget breakdown
                {activeCategories > 0 && (
                  <span className="ml-1 text-foreground font-medium">
                    ({activeCategories} categories)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>
                Expense log
                {expenseCount > 0 && (
                  <span className="ml-1 text-foreground font-medium">
                    ({expenseCount} transactions)
                  </span>
                )}
              </span>
            </div>
          </div>
          {format === 'excel' && (
            <p className="text-xs text-muted-foreground border-t pt-3">
              Excel file contains 3 sheets: Overview, Budget, and Expenses.
            </p>
          )}
          {format === 'csv' && (
            <p className="text-xs text-muted-foreground border-t pt-3">
              CSV contains the expense log only. Use Excel export for the full budget summary.
            </p>
          )}
          {format === 'print' && (
            <p className="text-xs text-muted-foreground border-t pt-3">
              A new tab will open with the print view. Use <strong>Ctrl+P</strong> (or ⌘+P) and choose "Save as PDF".
            </p>
          )}
        </CardContent>
      </Card>

      {/* Export button */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={() => void handleExport()}
          disabled={isExporting}
          className="gap-2"
        >
          {format === 'print' ? (
            <Printer className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting
            ? 'Exporting…'
            : format === 'print'
              ? 'Open Print View'
              : `Download ${format.toUpperCase()}`}
        </Button>
        {expenseCount === 0 && format === 'csv' && (
          <p className="text-sm text-muted-foreground">No expenses to export yet.</p>
        )}
      </div>
    </div>
  );
}
