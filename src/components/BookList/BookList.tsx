// src/components/BookList/BookList.tsx (versão simples)
import type { Volume } from '../../api/types/googleBooks';
import BookCard from '../BookCard/BookCard';

interface Props {
  books: Volume[];
  loading: boolean;
  error: string | null;
}

export default function BookList({ books, loading, error }: Props) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} volume={book} />
      ))}
    </div>
  );
}