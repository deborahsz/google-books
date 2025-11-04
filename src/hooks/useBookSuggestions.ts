import { useEffect, useState } from 'react';
import type { Volume } from '../api/types/googleBooks';
import { fetchBooks } from '../api/books';
import useDebouncedValue from './useDebouncedValue';

export type Suggestion = {
  id: string;
  title: string;
};

export default function useBookSuggestions(query: string, maxResults = 8) {
  const debounced = useDebouncedValue(query, 300);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const q = debounced.trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const vols: Volume[] = await fetchBooks(q, maxResults);
        if (!active) return;
        const uniqueTitles = new Map<string, string>();
        for (const v of vols) {
          const title = v.volumeInfo.title?.trim();
          if (title && !uniqueTitles.has(title)) {
            uniqueTitles.set(title, v.id);
          }
        }
        setSuggestions(Array.from(uniqueTitles.entries()).map(([title, id]) => ({ id, title })));
      } catch (e) {
        if (!active) return;
        const msg = e instanceof Error ? e.message : 'Erro ao carregar sugestões';
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [debounced, maxResults]);

  return { suggestions, loading, error } as const;
}