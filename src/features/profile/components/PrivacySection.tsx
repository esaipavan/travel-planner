import { useState } from 'react';
import { Download, Trash2, HardDrive, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { useExportData, useDeleteUploadedFiles, useDeleteAccount } from '../hooks/useProfile';

export function PrivacySection() {
  const [deleteFileInput, setDeleteFileInput] = useState('');
  const [deleteAcctInput, setDeleteAcctInput] = useState('');

  const exportData    = useExportData();
  const deleteFiles   = useDeleteUploadedFiles();
  const deleteAccount = useDeleteAccount();

  function clearLocalCache() {
    const keysToRemove = Object.keys(localStorage).filter(
      (k) => k.startsWith('travel-planner') || k.startsWith('sb-'),
    );
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    queryClient.clear();
    toast.success('Local cache cleared — refreshing…');
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <div className="space-y-4">
      {/* Export data */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Export Your Data</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Download all your trips, expenses, journal entries, documents, and reminders as JSON.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={exportData.isPending}
          onClick={() => exportData.mutate()}
        >
          {exportData.isPending ? 'Preparing export…' : 'Export Data (JSON)'}
        </Button>
      </div>

      {/* Clear local cache */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <HardDrive className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Clear Local Cache</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Removes cached data from your browser. The page will reload and re-fetch data from the server.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearLocalCache}>
          Clear Cache
        </Button>
      </div>

      {/* Delete uploaded files */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Trash2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Delete Uploaded Files</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently removes your profile photo and any other files you have uploaded.
            </p>
          </div>
        </div>
        <AlertDialog onOpenChange={() => setDeleteFileInput('')}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
              Delete Uploaded Files
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all uploaded files?</AlertDialogTitle>
              <AlertDialogDescription>
                Your profile photo and all uploaded files will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-2">
              <p className="text-sm font-medium">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </p>
              <Input
                value={deleteFileInput}
                onChange={(e) => setDeleteFileInput(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteFileInput !== 'DELETE' || deleteFiles.isPending}
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={() => deleteFiles.mutate()}
              >
                {deleteFiles.isPending ? 'Deleting…' : 'Delete Files'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Delete account */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <UserX className="h-4 w-4 text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-destructive">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently deletes your account and all data. This cannot be undone.
            </p>
          </div>
        </div>
        <AlertDialog onOpenChange={() => setDeleteAcctInput('')}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Delete My Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                All your trips, expenses, journal entries, documents, reminders, and uploaded files will be deleted. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-2">
              <p className="text-sm font-medium">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </p>
              <Input
                value={deleteAcctInput}
                onChange={(e) => setDeleteAcctInput(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteAcctInput !== 'DELETE' || deleteAccount.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deleteAccount.mutate()}
              >
                {deleteAccount.isPending ? 'Deleting…' : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
