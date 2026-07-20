import { useMemo, useState } from 'react';
import { Search, MapPin, MapPinOff, RefreshCw, X, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';
import { useNearbyPlaces } from '../hooks/useNearby';
import { CategoryFilter } from '../components/CategoryFilter';
import { PlaceCard } from '../components/PlaceCard';
import { PLACE_CATEGORIES } from '../types';
import type { PlaceCategory } from '../types';

function NearbyPageSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function NearbyPage() {
  const [input,       setInput]       = useState('');
  const [destination, setDestination] = useState('');
  const [category,    setCategory]    = useState<PlaceCategory | 'all'>('all');
  const [search,      setSearch]      = useState('');

  const qc = useQueryClient();

  const { data, isLoading, isError, isFetching } = useNearbyPlaces(destination);

  function handleSearch() {
    const q = input.trim();
    if (!q) return;
    setSearch('');
    setCategory('all');
    if (q === destination) {
      qc.invalidateQueries({ queryKey: ['nearby', destination] });
    } else {
      setDestination(q);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleRefresh() {
    qc.invalidateQueries({ queryKey: ['nearby', destination] });
  }

  const counts = useMemo<Partial<Record<PlaceCategory, number>>>(() => {
    if (!data) return {};
    const map: Partial<Record<PlaceCategory, number>> = {};
    for (const p of data.places) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let result = data.places;
    if (category !== 'all') result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q),
      );
    }
    return result;
  }, [data, category, search]);

  const activeCatMeta = PLACE_CATEGORIES.find((c) => c.value === category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nearby Places"
        description="Find restaurants, hotels, hospitals and more"
      />

      {/* Destination search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9"
            placeholder="Search destination — e.g. Bali, Tokyo, Paris…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch} disabled={!input.trim() || isFetching}>
          {isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
        {destination && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {/* Empty prompt */}
      {!destination && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground opacity-40" />
          <div className="space-y-1">
            <p className="font-medium">Search for a destination</p>
            <p className="text-sm text-muted-foreground">
              Enter a city or address to find nearby places.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {destination && isLoading && <NearbyPageSkeleton />}

      {/* Error */}
      {destination && isError && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <MapPinOff className="h-10 w-10 text-muted-foreground opacity-40" />
          <div className="space-y-1">
            <p className="font-medium">Could not load nearby places</p>
            <p className="text-sm text-muted-foreground">
              Check the destination name and try again.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Try again
          </Button>
        </div>
      )}

      {/* Results */}
      {data && !isError && (
        <div className="space-y-4">
          {/* Location label */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>

          {/* Category chips */}
          <CategoryFilter
            active={category}
            counts={counts}
            onChange={setCategory}
          />

          {/* Search within results */}
          {data.places.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 pr-9"
                placeholder={`Search within ${activeCatMeta ? activeCatMeta.label.toLowerCase() : 'results'}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Place list */}
          {data.places.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
              <MapPinOff className="h-8 w-8 text-muted-foreground opacity-40" />
              <p className="font-medium">No places found nearby</p>
              <p className="text-sm text-muted-foreground">
                Try a different destination or increase the search area.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
              <p className="font-medium">No results match your filters</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setCategory('all'); setSearch(''); }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {filtered.length} place{filtered.length !== 1 ? 's' : ''}
                {category !== 'all' || search ? ' matching filters' : ` within 3 km`}
              </p>
              {filtered.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
