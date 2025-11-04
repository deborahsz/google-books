// src\pages\Home.tsx
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import BookList from '../components/BookList/BookList';
import { fetchBooks } from '../api/books';
import type { Volume } from '../types/googleBooks';
import useDebouncedValue from '../hooks/useDebouncedValue';
import useBookSuggestions from '../hooks/useBookSuggestions';

export default function Home() {
  const [query, setQuery] = useState<string>('harry potter');
  const debounced = useDebouncedValue(query, 600);
  const [books, setBooks] = useState<Volume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { suggestions, loading: loadingSuggestions } = useBookSuggestions(query, 8);

  // Busca livros com debounce
  useEffect(() => {
    let active = true;
    
    const run = async () => {
      if (!debounced.trim()) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(debounced, 20);
        if (!active) return;
        setBooks(data);
      } catch (e) {
        if (!active) return;
        const msg = e instanceof Error ? e.message : 'Erro ao buscar livros';
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
  }, [debounced]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          onClear={handleClearSearch}
          onChange={(q) => setQuery(q)}
          suggestions={suggestions.map((s) => s.title)}
          loadingSuggestions={loadingSuggestions}
          onSelectSuggestion={(s) => setQuery(s)}
        />
      </div>

      {!loading && books.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🔍 Resultados para: "{query}"
          </h2>
          <p className="text-gray-600 mt-2">
            {books.length} livro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <BookList books={books} loading={loading} error={error} />
    </section>
  );
}