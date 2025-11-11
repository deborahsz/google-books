// src\pages\Home.tsx
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import BookList from '../components/BookList/BookList';
import { fetchBooks, fetchPopularBooks } from '../api/books';
import type { Volume } from '../api/types/googleBooks';
import useDebouncedValue from '../hooks/useDebouncedValue';
import useBookSuggestions from '../hooks/useBookSuggestions';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const debounced = useDebouncedValue(query, 600);
  const [books, setBooks] = useState<Volume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopular, setShowPopular] = useState<boolean>(true);
  
  // Estados para controlar o scroll infinito
  const [page, setPage] = useState<number>(0); // Página atual (0 = primeira página)
  const [hasMore, setHasMore] = useState<boolean>(true); // Se tem mais resultados para carregar
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // Se está carregando mais itens
  
  const RESULTS_PER_PAGE = 20; // Quantos livros carregar por vez

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
        const data = await fetchPopularBooks(RESULTS_PER_PAGE);
        setBooks(data);
        setShowPopular(true);
        setPage(0);
        setHasMore(true); // Assume que tem mais resultados para popular
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro ao buscar livros populares';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadPopularBooks();
  }, []);

  // Busca quando o usuário digita (RESETA para a primeira página)
  useEffect(() => {
    let active = true;
    
    const run = async () => {
      if (!debounced.trim()) {
        // Se a busca estiver vazia, mostra os populares novamente
        if (!showPopular) {
          setLoading(true);
          try {
            const data = await fetchPopularBooks(RESULTS_PER_PAGE);
            if (!active) return;
            setBooks(data);
            setShowPopular(true);
            setPage(0); // Reseta para primeira página
            setHasMore(true);
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

      // Nova busca - reseta para a primeira página
      setLoading(true);
      setError(null);
      setPage(0); // Reseta página
      setHasMore(true); // Assume que tem mais resultados
      try {
        const data = await fetchBooks(debounced, RESULTS_PER_PAGE, 0); // startIndex = 0
        if (!active) return;
        setBooks(data);
        setShowPopular(false);
        // Se retornou menos que o esperado, provavelmente não tem mais
        if (data.length < RESULTS_PER_PAGE) {
          setHasMore(false);
        }
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

  // Função para carregar mais resultados (scroll infinito)
  const loadMore = async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    setError(null);
    
    const nextPage = page + 1;
    const startIndex = nextPage * RESULTS_PER_PAGE;

    try {
      let newBooks: Volume[];
      
      if (showPopular) {
        // Carregando mais livros populares
        newBooks = await fetchPopularBooks(RESULTS_PER_PAGE, startIndex);
      } else {
        // Carregando mais resultados de busca
        newBooks = await fetchBooks(debounced, RESULTS_PER_PAGE, startIndex);
      }

      // Adiciona os novos livros aos existentes (sem duplicatas)
      setBooks(prev => {
        const existingIds = new Set(prev.map(b => b.id));
        const filtered = newBooks.filter(b => !existingIds.has(b.id));
        return [...prev, ...filtered];
      });
      
      setPage(nextPage);

      // Se retornou menos livros que o esperado, não tem mais resultados
      if (newBooks.length < RESULTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar mais livros';
      setError(msg);
    } finally {
      setLoadingMore(false);
    }
  };

  // Usa o hook de scroll infinito
  useInfiniteScroll({
    onLoadMore: loadMore,
    isLoading: loadingMore,
    hasMore: hasMore
  });

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

      <BookList books={books} loading={loading} error={error} loadingMore={loadingMore} />
    </section>
  );
}