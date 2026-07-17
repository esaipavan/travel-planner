import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WikiInfo } from '../types';

interface Props {
  wiki:  WikiInfo;
  title: string;
}

export function WikiSummaryCard({ wiki, title }: Props) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {wiki.thumbnailUrl && (
        <img
          src={wiki.thumbnailUrl}
          alt={wiki.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-6">
          {wiki.extract}
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href={wiki.wikiUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Read more on Wikipedia
          </a>
        </Button>
      </div>
    </div>
  );
}
