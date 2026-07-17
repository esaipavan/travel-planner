import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Upload, Search, FileText, SlidersHorizontal, X, Clock, ArrowLeft } from 'lucide-react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch }   from '@/components/ui/switch';
import { Label }    from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  useDocuments,
  useUserTrips,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '../hooks/useDocuments';
import { DocumentStats } from '../components/DocumentStats';
import { DocumentCard }  from '../components/DocumentCard';
import { DocumentDialog } from '../components/DocumentDialog';
import {
  DOCUMENT_TYPES,
  getExpiryStatus,
  type TravelDocumentRow,
  type DocumentFilters,
  type DocumentFormValues,
} from '../types';

// ── Loading skeleton ──────────────────────────────────────────────────────────

function DocsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Default filters ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS: DocumentFilters = {
  search:       '',
  type:         '',
  tripId:       '',
  expiringSoon: false,
  sortOrder:    'newest',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  // Present on /trips/:id/documents; undefined on /documents
  const { id: tripId } = useParams<{ id?: string }>();

  const { data: documents = [], isLoading }      = useDocuments(tripId);
  const { data: trips = [], isLoading: tripsLoading } = useUserTrips();

  // Used for the back link label and page description when scoped to a trip
  const currentTrip = tripId ? trips.find((t) => t.id === tripId) : undefined;

  const uploadMutation = useUploadDocument();
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();

  const [dialogOpen,  setDialogOpen]  = useState(false);
  const [editDoc,     setEditDoc]     = useState<TravelDocumentRow | null>(null);
  const [deleteDoc,   setDeleteDoc]   = useState<TravelDocumentRow | null>(null);
  const [filters,     setFilters]     = useState<DocumentFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // ── Trip lookup map ─────────────────────────────────────────────────────────
  const tripMap = useMemo(
    () => Object.fromEntries(trips.map((t) => [t.id, t.title])),
    [trips],
  );

  // ── Filtered / sorted list ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...documents];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.country     ?? '').toLowerCase().includes(q) ||
          (d.notes       ?? '').toLowerCase().includes(q),
      );
    }

    if (filters.type) {
      result = result.filter((d) => d.type === filters.type);
    }

    if (filters.tripId) {
      result = result.filter((d) => d.trip_id === filters.tripId);
    }

    if (filters.expiringSoon) {
      result = result.filter((d) => {
        const s = getExpiryStatus(d.expiry_date);
        return s === 'expiring_soon' || s === 'expired';
      });
    }

    result.sort((a, b) => {
      const diff =
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return filters.sortOrder === 'newest' ? diff : -diff;
    });

    return result;
  }, [documents, filters]);

  const hasActiveFilter =
    !!filters.search || !!filters.type || !!filters.tripId || filters.expiringSoon;

  // ── Handlers ────────────────────────────────────────────────────────────────
  function openUpload() {
    setEditDoc(null);
    setDialogOpen(true);
  }

  function openEdit(doc: TravelDocumentRow) {
    setEditDoc(doc);
    setDialogOpen(true);
  }

  async function handleSave(values: DocumentFormValues, file?: File) {
    if (editDoc) {
      await updateMutation.mutateAsync({ id: editDoc.id, values });
    } else {
      if (!file) return;
      await uploadMutation.mutateAsync({ values, file });
    }
    setDialogOpen(false);
    setEditDoc(null);
  }

  function confirmDelete(doc: TravelDocumentRow) {
    setDeleteDoc(doc);
  }

  function executeDelete() {
    if (!deleteDoc) return;
    deleteMutation.mutate({ id: deleteDoc.id, fileUrl: deleteDoc.file_url });
    setDeleteDoc(null);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const isSaving = uploadMutation.isPending || updateMutation.isPending;

  // ── Expiring-soon count for filter chip label ───────────────────────────────
  const expiringSoonCount = useMemo(
    () =>
      documents.filter(
        (d) => getExpiryStatus(d.expiry_date) === 'expiring_soon',
      ).length,
    [documents],
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {tripId && (tripsLoading || currentTrip) && (
        <Link
          to={`/trips/${tripId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {currentTrip ? `Back to ${currentTrip.title}` : 'Back to trip'}
        </Link>
      )}

      <PageHeader
        title="Travel Documents"
        description={
          currentTrip
            ? `Documents for ${currentTrip.title}`
            : 'Passports, visas, tickets and all your essential travel paperwork'
        }
      >
        <Button onClick={openUpload} disabled={!!tripId && tripsLoading}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </PageHeader>

      {isLoading ? (
        <DocsSkeleton />
      ) : (
        <>
          {/* Stats */}
          {documents.length > 0 && <DocumentStats documents={documents} />}

          {/* Search + filter bar */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search by title, country, or notes…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                />
              </div>

              {expiringSoonCount > 0 && (
                <Button
                  variant={filters.expiringSoon ? 'secondary' : 'outline'}
                  size="sm"
                  className="shrink-0 gap-1.5"
                  onClick={() =>
                    setFilters((f) => ({ ...f, expiringSoon: !f.expiringSoon }))
                  }
                >
                  <Clock className="h-3.5 w-3.5" />
                  Expiring ({expiringSoonCount})
                </Button>
              )}

              <Button
                variant={showFilters ? 'secondary' : 'outline'}
                size="icon"
                onClick={() => setShowFilters((v) => !v)}
                title="More filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>

              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card px-4 py-3">
                {/* Type */}
                <div className="flex items-center gap-2">
                  <Label className="shrink-0 text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={filters.type || '_all'}
                    onValueChange={(v) =>
                      setFilters((f) => ({ ...f, type: v === '_all' ? '' : v }))
                    }
                  >
                    <SelectTrigger className="h-8 w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">All types</SelectItem>
                      {DOCUMENT_TYPES.map((dt) => (
                        <SelectItem key={dt.value} value={dt.value}>
                          {dt.emoji} {dt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trip — hidden when already scoped to a specific trip via URL */}
                {!tripId && trips.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Label className="shrink-0 text-xs text-muted-foreground">Trip</Label>
                    <Select
                      value={filters.tripId || '_all'}
                      onValueChange={(v) =>
                        setFilters((f) => ({
                          ...f,
                          tripId: v === '_all' ? '' : v,
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">All trips</SelectItem>
                        {trips.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Label className="shrink-0 text-xs text-muted-foreground">Sort</Label>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(v) =>
                      setFilters((f) => ({
                        ...f,
                        sortOrder: v as DocumentFilters['sortOrder'],
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Expiring soon switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="expiring-sw"
                    checked={filters.expiringSoon}
                    onCheckedChange={(v) =>
                      setFilters((f) => ({ ...f, expiringSoon: v }))
                    }
                  />
                  <Label htmlFor="expiring-sw" className="cursor-pointer text-xs">
                    Expiring / Expired only
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Count */}
          {documents.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {filtered.length === documents.length
                ? `${documents.length} ${documents.length === 1 ? 'document' : 'documents'}`
                : `${filtered.length} of ${documents.length} documents`}
            </p>
          )}

          {/* Empty — no documents at all */}
          {documents.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
              <FileText className="h-10 w-10 text-muted-foreground opacity-40" />
              <div className="space-y-1">
                <p className="font-medium">No documents yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload your passports, visas, tickets and more.
                </p>
              </div>
              <Button onClick={openUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload first document
              </Button>
            </div>
          )}

          {/* Empty — filter too strict */}
          {documents.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground opacity-40" />
              <p className="font-medium">No documents match your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  tripTitle={doc.trip_id ? tripMap[doc.trip_id] : undefined}
                  onEdit={openEdit}
                  onDelete={confirmDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload / Edit dialog */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditDoc(null);
        }}
        document={editDoc}
        trips={trips}
        onSave={handleSave}
        isPending={isSaving}
        defaultTripId={tripId}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteDoc}
        onOpenChange={(open) => { if (!open) setDeleteDoc(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteDoc?.name}" will be permanently deleted from storage.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
