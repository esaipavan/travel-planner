import { useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CurrencyMap } from '../types';

interface Props {
  value:      string;
  onChange:   (code: string) => void;
  currencies: CurrencyMap;
  disabled?:  boolean;
}

export function CurrencySelect({ value, onChange, currencies, disabled }: Props) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');

  const entries = Object.entries(currencies);

  const filtered = search.trim()
    ? entries.filter(
        ([code, name]) =>
          code.toLowerCase().includes(search.toLowerCase()) ||
          name.toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  const selectedName = currencies[value] ?? value;

  function select(code: string) {
    onChange(code);
    setOpen(false);
    setSearch('');
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-medium"
        >
          <span className="truncate text-left">
            <span className="font-bold">{value}</span>
            {selectedName && selectedName !== value && (
              <span className="ml-2 font-normal text-muted-foreground">
                {selectedName}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        {/* Search */}
        <div className="flex items-center border-b px-3 py-2 gap-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search currency…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            autoFocus
          />
        </div>

        {/* List */}
        <ScrollArea className="h-64">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No currencies found.
            </p>
          ) : (
            <div className="p-1">
              {filtered.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => select(code)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Check
                    className={`h-4 w-4 shrink-0 ${
                      value === code ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span className="font-medium w-10 shrink-0">{code}</span>
                  <span className="truncate text-muted-foreground">{name}</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
