'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchIndex, type SearchEntry } from '@/lib/admin-search-index';

const CATEGORY_ORDER = ['Navigation', 'Content', 'Settings', 'Help'];

function groupResults(results: SearchEntry[]): [string, SearchEntry[]][] {
  const map = new Map<string, SearchEntry[]>();
  for (const entry of results) {
    if (!map.has(entry.category)) map.set(entry.category, []);
    map.get(entry.category)!.push(entry);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)!]);
}

interface Props {
  onOpenDocs?: never; // deprecated — docs now at /protected/docs
}

export function AdminSearch(_props?: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchIndex(query);
  const flat = results;

  const reset = useCallback(() => {
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
    setMobileExpanded(false);
  }, []);

  const navigate = useCallback(
    (entry: SearchEntry) => {
      router.push(entry.href);
      reset();
    },
    [router, reset]
  );

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMobileExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        reset();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [reset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { reset(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flat[activeIndex]) {
      navigate(flat[activeIndex]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(0);
  };

  const groups = groupResults(results);

  // Compute flat index offset per entry for active highlighting
  let flatOffset = 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Mobile: icon button → expands to input */}
      <button
        className={cn(
          'sm:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent text-muted-foreground transition-colors',
          mobileExpanded && 'hidden'
        )}
        onClick={() => {
          setMobileExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Input (desktop always visible; mobile only when expanded) */}
      <div
        className={cn(
          'flex items-center gap-2 h-8 rounded-md border bg-muted/50 px-2.5 transition-all',
          'hidden sm:flex',
          mobileExpanded && '!flex fixed top-3 left-4 right-4 z-50 sm:static sm:z-auto bg-background shadow-md sm:shadow-none',
          !mobileExpanded && 'sm:w-48 lg:w-64'
        )}
      >
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search… (⌘K)"
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground min-w-0"
        />
        {query && (
          <button onClick={reset} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        )}
        {mobileExpanded && !query && (
          <button
            className="sm:hidden text-muted-foreground hover:text-foreground ml-1"
            onClick={reset}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-72 rounded-md border bg-popover shadow-lg overflow-hidden',
            mobileExpanded
              ? 'fixed top-[3.25rem] left-4 right-4 w-auto sm:absolute sm:top-full sm:left-auto sm:right-0 sm:w-72'
              : 'right-0 top-full'
          )}
        >
          {groups.map(([category, entries]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
                {category}
              </div>
              {entries.map((entry) => {
                const Icon = entry.icon;
                const idx = flatOffset++;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={entry.href + entry.label}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => navigate(entry)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {entry.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query && results.length === 0 && (
        <div
          className={cn(
            'absolute z-50 mt-1 rounded-md border bg-popover shadow-lg px-4 py-3 text-sm text-muted-foreground',
            mobileExpanded
              ? 'fixed top-[3.25rem] left-4 right-4 w-auto'
              : 'right-0 top-full w-64'
          )}
        >
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
