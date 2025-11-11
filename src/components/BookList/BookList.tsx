// src/components/BookList/BookList.tsx
import type { Volume } from '../../api/types/googleBooks';
import BookCard from '../BookCard/BookCard';

interface Props {
  books: Volume[];
  loading: boolean;
  error: string | null;
  loadingMore?: boolean; // Novo: indica se está carregando mais itens (scroll infinito)
}

export default function BookList({ books, loading, error, loadingMore = false }: Props) {
  // Se está carregando a primeira página
  if (loading) {
    return <div className="text-center py-8">Carregando livros...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erro: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="text-center py-8 text-gray-600">Nenhum livro encontrado.</div>;
  }

  return (
    <div>
      {/* Grid de livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} volume={book} />
        ))}
      </div>

      {/* Indicador de carregamento no scroll infinito */}
      {loadingMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Carregando mais livros...</span>
          </div>
        </div>
      )}
    </div>
  );
}