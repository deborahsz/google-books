// Hook para detectar quando o usuário chegou perto do fim da página
// e disparar o carregamento de mais itens (scroll infinito)
import { useEffect } from 'react';

interface UseInfiniteScrollOptions {
  // Função que será chamada quando precisar carregar mais dados
  onLoadMore: () => void;
  // Se está carregando dados no momento (evita chamadas duplicadas)
  isLoading: boolean;
  // Se tem mais dados para carregar
  hasMore: boolean;
  // Distância em pixels do fim da página para começar a carregar (padrão: 300px)
  threshold?: number;
}

export default function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 300
}: UseInfiniteScrollOptions) {
  useEffect(() => {
    // Função que verifica se o usuário está próximo do fim da página
    const handleScroll = () => {
      // Se já está carregando ou não tem mais dados, não faz nada
      if (isLoading || !hasMore) return;

      // Calcula a distância do fim da página
      // scrollY = quanto já foi scrollado
      // innerHeight = altura da janela visível
      // document.documentElement.scrollHeight = altura total da página
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Se a distância até o fim for menor que o threshold, carrega mais
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    // Adiciona o listener de scroll
    window.addEventListener('scroll', handleScroll);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore, isLoading, hasMore, threshold]);
}
