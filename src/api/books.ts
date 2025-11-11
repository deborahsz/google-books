import type { Volume } from './types/googleBooks';

export async function fetchBooks(query: string, maxResults = 20, startIndex = 0): Promise<Volume[]> {
  const q = query?.trim();
  if (!q) return [];

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&printType=books&maxResults=${maxResults}&startIndex=${startIndex}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livros: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasImage = (imageLinks: any): boolean => !!(
      imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.small || imageLinks?.medium
    );

    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false;

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false;

      if (!hasImage(vi.imageLinks)) return false;

      if (vi.maturityRating === 'MATURE') return false;

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false;

      return true;
    });

    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: {
            thumbnail: vi.imageLinks?.thumbnail,
            smallThumbnail: vi.imageLinks?.smallThumbnail,
            small: vi.imageLinks?.small,
            medium: vi.imageLinks?.medium,
            large: vi.imageLinks?.large,
            extraLarge: vi.imageLinks?.extraLarge,
          },
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
          previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
          publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
          publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
          pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
          categories: Array.isArray(vi.categories) ? vi.categories : undefined,
          averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
          ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
          language: typeof vi.language === 'string' ? vi.language : undefined,
          industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
        },
      };
    });

    return mapped;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros';
    throw new Error(`Erro de rede ao buscar livros: ${message}`);
  }
}

export async function fetchPopularBooks(maxResults = 20, startIndex = 0): Promise<Volume[]> {
  const popularQueries = [
    'bestseller',
    'fiction bestseller 2024',
    'romance',
    'fantasia',
    'ficção científica',
    'autoajuda',
    'biografia',
    'história'
  ];

  const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
  
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(randomQuery)}&printType=books&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livros populares: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const items: any[] = Array.isArray(data?.items) ? data.items : [];

    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasImage = (imageLinks: any): boolean => !!(
      imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.small || imageLinks?.medium
    );

    const filtered = items.filter((it) => {
      const vi = it?.volumeInfo;
      const id = it?.id;
      if (!id || !vi) return false;

      const description = typeof vi.description === 'string' ? vi.description.trim() : '';
      if (!description) return false;

      if (!hasImage(vi.imageLinks)) return false;

      if (vi.maturityRating === 'MATURE') return false;

      const descNorm = normalize(description);
      const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
      if (banned) return false;

      return true;
    });

    const mapped: Volume[] = filtered.map((it) => {
      const vi = it.volumeInfo;
      return {
        id: it.id as string,
        volumeInfo: {
          title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
          subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
          authors: Array.isArray(vi.authors) ? vi.authors : undefined,
          description: vi.description as string,
          imageLinks: {
            thumbnail: vi.imageLinks?.thumbnail,
            smallThumbnail: vi.imageLinks?.smallThumbnail,
            small: vi.imageLinks?.small,
            medium: vi.imageLinks?.medium,
            large: vi.imageLinks?.large,
            extraLarge: vi.imageLinks?.extraLarge,
          },
          maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
          infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
          previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
          publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
          publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
          pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
          categories: Array.isArray(vi.categories) ? vi.categories : undefined,
          averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
          ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
          language: typeof vi.language === 'string' ? vi.language : undefined,
          industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
        },
      };
    });

    return mapped;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livros populares';
    throw new Error(`Erro de rede ao buscar livros populares: ${message}`);
  }
}

export async function fetchBookById(bookId: string): Promise<Volume | null> {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Falha ao buscar livro: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    const bannedWords = [
      'sex', 'porn', 'pornography', 'xxx', 'erotic', 'sexual', 'nudity',
      'sexo', 'pornô', 'erótico', 'adulto', 'nudez', 'porno'
    ];

    const normalize = (s: string): string => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const hasImage = (imageLinks: any): boolean => !!(
      imageLinks?.thumbnail || imageLinks?.smallThumbnail || imageLinks?.small || imageLinks?.medium
    );

    const vi = data.volumeInfo;
    const description = typeof vi.description === 'string' ? vi.description.trim() : '';
    
    if (vi.maturityRating === 'MATURE') return null;

    const descNorm = normalize(description);
    const banned = bannedWords.some((w) => descNorm.includes(normalize(w)));
    if (banned) return null;

    if (!hasImage(vi.imageLinks)) return null;

    const volume: Volume = {
      id: data.id as string,
      volumeInfo: {
        title: typeof vi.title === 'string' ? vi.title : 'Título desconhecido',
        subtitle: typeof vi.subtitle === 'string' ? vi.subtitle : undefined,
        authors: Array.isArray(vi.authors) ? vi.authors : undefined,
        description: vi.description as string,
        imageLinks: {
          thumbnail: vi.imageLinks?.thumbnail,
          smallThumbnail: vi.imageLinks?.smallThumbnail,
          small: vi.imageLinks?.small,
          medium: vi.imageLinks?.medium,
          large: vi.imageLinks?.large,
          extraLarge: vi.imageLinks?.extraLarge,
        },
        maturityRating: typeof vi.maturityRating === 'string' ? vi.maturityRating : undefined,
        infoLink: typeof vi.infoLink === 'string' ? vi.infoLink : undefined,
        previewLink: typeof vi.previewLink === 'string' ? vi.previewLink : undefined,
        publishedDate: typeof vi.publishedDate === 'string' ? vi.publishedDate : undefined,
        publisher: typeof vi.publisher === 'string' ? vi.publisher : undefined,
        pageCount: typeof vi.pageCount === 'number' ? vi.pageCount : undefined,
        categories: Array.isArray(vi.categories) ? vi.categories : undefined,
        averageRating: typeof vi.averageRating === 'number' ? vi.averageRating : undefined,
        ratingsCount: typeof vi.ratingsCount === 'number' ? vi.ratingsCount : undefined,
        language: typeof vi.language === 'string' ? vi.language : undefined,
        industryIdentifiers: Array.isArray(vi.industryIdentifiers) ? vi.industryIdentifiers : undefined,
      },
    };

    return volume;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar livro';
    throw new Error(`Erro de rede ao buscar livro: ${message}`);
  }
}