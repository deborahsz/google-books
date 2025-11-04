// src/components/SearchBar/SearchBar.tsx
import { useEffect, useRef, useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  defaultValue?: string;
  onClear?: () => void;
  onChange?: (q: string) => void;
  suggestions?: string[];
  loadingSuggestions?: boolean;
  onSelectSuggestion?: (q: string) => void;
}

export default function SearchBar({
  onSearch,
  defaultValue = '',
  onClear,
  onChange,
  suggestions = [],
  loadingSuggestions = false,
  onSelectSuggestion,
}: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    onSearch(q);
  };

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    onClear?.();
  };

  const onInput = (v: string) => {
    setQuery(v);
    onChange?.(v);
    setOpen(!!v.trim());
  };

  const select = (s: string) => {
    setQuery(s);
    setOpen(false);
    onSelectSuggestion?.(s);
    onSearch(s);
  };

  const showList = open && (loadingSuggestions || suggestions.length > 0);

  return (
    <div className="relative" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => onInput(e.target.value)}
          placeholder="Buscar livros..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={showList}
          aria-controls="autocomplete-list"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buscar
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Limpar
          </button>
        )}
      </form>

      {showList && (
        <div
          id="autocomplete-list"
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          {loadingSuggestions && (
            <div className="px-3 py-2 text-sm text-gray-600">Carregando…</div>
          )}
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => select(s)}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100"
              role="option"
            >
              {s}
            </button>
          ))}
          {!loadingSuggestions && suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">Sem sugestões</div>
          )}
        </div>
      )}
    </div>
  );
}