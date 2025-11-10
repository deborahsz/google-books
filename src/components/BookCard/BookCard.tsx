import type { Volume } from '../../api/types/googleBooks';
import { useMemo } from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

type Props = {
  volume: Volume;
};

function getCoverUrl(imageLinks: Volume['volumeInfo']['imageLinks']): string | undefined {
  return (
    imageLinks?.thumbnail ||
    imageLinks?.smallThumbnail ||
    imageLinks?.small ||
    imageLinks?.medium
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export default function BookCard({ volume }: Props) {
  const navigate = useNavigate();
  const cover = useMemo(() => getCoverUrl(volume.volumeInfo.imageLinks), [volume.volumeInfo.imageLinks]);

  const rawDesc = volume.volumeInfo.description ?? '';
  const cleanDesc = useMemo(() => stripHtml(rawDesc), [rawDesc]);
  const shortDesc = useMemo(() => truncate(cleanDesc, 200), [cleanDesc]);

  const authors = volume.volumeInfo.authors?.length
    ? volume.volumeInfo.authors.join(', ')
    : 'Autor desconhecido';

  const handleCardClick = () => {
    navigate(`/book/${volume.id}`, { state: { volume } });
  };

  const [coverLoading, setCoverLoading] = React.useState(true);

  React.useEffect(() => {
    if (cover) {
      const cvr = new Image();
      cvr.onload = () => setCoverLoading(false);
      cvr.src = cover.replace('http://', 'https://');
    }
  }, [cover]);



  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
      {coverLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={240}
          sx={{
            borderRadius: 2,
            boxShadow: 4,
            display: 'block',
            bgcolor: 'grey.100'
          }}
        />
      ) : cover && (
        <CardMedia
          component="img"
          height="240"
          image={cover}
          alt={`Capa de ${volume.volumeInfo.title}`}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" component="h3" fontWeight="bold" lineHeight={1.2}>
          {volume.volumeInfo.title}
        </Typography>

        <Chip
          label={authors}
          size="small"
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {shortDesc}
        </Typography>
      </CardContent>
    </Card>
  );
}