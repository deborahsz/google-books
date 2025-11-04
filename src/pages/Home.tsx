// src\pages\Home.tsx
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import BookList from '../components/BookList/BookList';
import { fetchBooks, fetchPopularBooks } from '../api/books';
import type { Volume } from '../api/types/googleBooks';
import useDebouncedValue from '../hooks/useDebouncedValue';
import useBookSuggestions from '../hooks/useBookSuggestions';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const debounced = useDebouncedValue(query, 600);
  const [books, setBooks] = useState<Volume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopular, setShowPopular] = useState<boolean>(true);

  // Autocomplete suggestions
  const {
    suggestions: suggestionObjs,
    loading: loadingSuggestions,
  } = useBookSuggestions(query, 8);
  const suggestions = suggestionObjs.map((s) => s.title);

  // Carrega livros populares ao inicializar
  useEffect(() => {
    const loadPopularBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPopularBooks(20);
        setBooks(data);
        setShowPopular(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro ao buscar livros populares';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadPopularBooks();
  }, []);

  // Busca quando o usuário digita
  useEffect(() => {
    let active = true;
    
    const run = async () => {
      if (!debounced.trim()) {
        // Se a busca estiver vazia, mostra os populares novamente
        if (!showPopular) {
          setLoading(true);
          try {
            const data = await fetchPopularBooks(20);
            if (!active) return;
            setBooks(data);
            setShowPopular(true);
          } catch (e) {
            if (!active) return;
            const msg = e instanceof Error ? e.message : 'Erro ao buscar livros populares';
            setError(msg);
          } finally {
            if (active) setLoading(false);
          }
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooks(debounced, 20);
        if (!active) return;
        setBooks(data);
        setShowPopular(false);
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
  }, [debounced, showPopular]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleClearSearch = () => {
    setQuery('');
    setShowPopular(true);
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          onClear={handleClearSearch}
          onChange={(v) => setQuery(v)}
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          onSelectSuggestion={(s) => setQuery(s)}
        />
      </div>

      {showPopular && !loading && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📚 Livros em Alta</h2>
          <p className="text-gray-600 mt-2">Descubra os livros mais populares no momento</p>
        </div>
      )}

      {!showPopular && !loading && books.length > 0 && (
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