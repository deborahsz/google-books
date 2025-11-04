export type ImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
};

export type VolumeInfo = {
  title: string;
  subtitle?: string;
  authors?: string[];
  description: string;
  imageLinks: ImageLinks;
  maturityRating?: string;
  infoLink?: string;
  previewLink?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
};

export type Volume = {
  id: string;
  volumeInfo: VolumeInfo;
};