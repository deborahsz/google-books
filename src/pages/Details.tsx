import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Rating,
  Divider,
  Alert,
  Skeleton
} from '@mui/material';
import { ArrowBack, Launch, MenuBook, CalendarToday, Language, Business } from '@mui/icons-material';
import type { Volume } from '../api/types/googleBooks';
import React from 'react';

interface LocationState {
  volume: Volume;
}

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const volume = state?.volume;

  if (!volume) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
          Voltar para Início
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6">
            Livro não encontrado
          </Typography>
          <Typography variant="body2">
            O livro que você está procurando não pôde ser carregado.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const { volumeInfo } = volume;
  
  const coverUrl = volumeInfo.imageLinks?.extraLarge || 
                   volumeInfo.imageLinks?.large || 
                   volumeInfo.imageLinks?.medium || 
                   volumeInfo.imageLinks?.thumbnail;

  const publishedYear = volumeInfo.publishedDate 
    ? new Date(volumeInfo.publishedDate).getFullYear()
    : null;

  const categories = Array.isArray(volumeInfo.categories) 
    ? volumeInfo.categories 
    : [];

  const averageRating = volumeInfo.averageRating || 0;
  const ratingsCount = volumeInfo.ratingsCount || 0;

  const industryIdentifiers = Array.isArray(volumeInfo.industryIdentifiers) 
    ? volumeInfo.industryIdentifiers 
    : [];

  const hasDescription = volumeInfo.description && volumeInfo.description.trim().length > 0;

  const [coverLoading, setCoverLoading] = React.useState(true);

  React.useEffect(() => {
    if(coverUrl) {
      const cvr = new Image();
      cvr.onload = () => setCoverLoading(false);
      cvr.src = coverUrl.replace('http://', 'https://');
    }
  }, [coverUrl]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Voltar
      </Button>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Coluna da imagem */}
          <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', justifyContent: 'center' }}>
            {coverLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{
                  borderRadius: 2,
                  boxShadow: 4,
                  display: 'block',
                  bgcolor: 'grey.100'
                }}
              />
            ) :
              coverUrl ? (
                <Box
                  component="img"
                  src={coverUrl.replace('http://', 'https://')}
                  alt={`Capa de ${volumeInfo.title}`}
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    borderRadius: 2,
                    boxShadow: 4,
                    display: 'block'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <Typography color="grey.500" textAlign="center">
                    📚<br />
                    Imagem não disponível
                  </Typography>
                </Box>
              )
            }
          </Box>

          {/* Coluna das informações */}
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                {volumeInfo.title}
              </Typography>

              {volumeInfo.subtitle && (
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                  {volumeInfo.subtitle}
                </Typography>
              )}

              <Typography variant="h6" color="text.primary" gutterBottom sx={{ mt: 2 }}>
                por <Box component="span" color="primary.main" fontWeight="medium">
                  {volumeInfo.authors?.join(', ') || 'Autor desconhecido'}
                </Box>
              </Typography>
            </Box>

            {(averageRating > 0 || volumeInfo.pageCount) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                {averageRating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={averageRating} precision={0.1} readOnly size="large" />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ratingsCount} avaliação{ratingsCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {volumeInfo.pageCount && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MenuBook color="action" />
                    <Typography variant="body1">
                      {volumeInfo.pageCount} páginas
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {publishedYear && (
                <Chip 
                  icon={<CalendarToday />} 
                  label={`Publicado em ${publishedYear}`} 
                  variant="outlined" 
                  size="small" 
                />
              )}
              
              {volumeInfo.publisher && (
                <Chip 
                  icon={<Business />} 
                  label={volumeInfo.publisher} 
                  variant="outlined" 
                  size="small" 
                />
              )}
              
              {volumeInfo.language && (
                <Chip 
                  icon={<Language />} 
                  label={`${volumeInfo.language.toUpperCase()}`} 
                  variant="outlined" 
                  size="small" 
                />
              )}
            </Box>

            {industryIdentifiers.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Identificadores:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {industryIdentifiers.map((identifier: any, index: number) => (
                    <Chip 
                      key={index}
                      label={`${identifier.type}: ${identifier.identifier}`}
                      size="small"
                      variant="filled"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {categories.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Categorias:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {categories.map((category: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={category} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="medium" color="primary">
                Sinopse
              </Typography>
              {hasDescription ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    textAlign: 'justify'
                  }}
                >
                  {volumeInfo.description?.replace(/<[^>]+>/g, '')}
                </Typography>
              ) : (
                <Alert severity="info">
                  Descrição não disponível para este livro.
                </Alert>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              
              {volumeInfo.infoLink && (
                <Button
                  variant="outlined"
                  startIcon={<Launch />}
                  href={volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                >
                  Ver no Google Books
                </Button>
              )}
              
              <Button
                variant="text"
                onClick={() => navigate('/')}
                size="large"
              >
                Voltar ao Início
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}