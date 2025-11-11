# 📚 Biblioteca Mágica

> Uma vitrine de livros que usa a API do Google Books para ajudar a descobrir histórias incríveis.

## ✨ Sobre o Projeto

Este projeto nasceu para entregar uma experiência de busca rápida e agradável. Assim que o usuário digita, ele já vê sugestões, pode navegar pelos destaques e, ao rolar a página, novos livros vão aparecendo automaticamente graças ao scroll infinito que implementamos.

## 🚀 Principais Funcionalidades

- 🔍 **Busca inteligente** por título ou palavra-chave usando a API do Google Books.
- 💡 **Sugestões automáticas** enquanto o usuário digita.
- 🔄 **Scroll infinito** que carrega novos resultados sem recarregar a página.
- 📈 Seção inicial com **livros populares** para quem quer inspiração rápida.
- 📖 Página de **detalhes do livro** com autores, sinopse, links e dados adicionais.

## 🛠️ Stack e Ferramentas

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) para o ambiente de desenvolvimento
- [Tailwind CSS](https://tailwindcss.com/) para estilização
- Hooks customizados (`useDebouncedValue`, `useBookSuggestions`, `useInfiniteScroll`)

## 📂 Estrutura básica

```
src/
├── api/               # Integração com Google Books
├── components/        # Componentes reutilizáveis
├── hooks/             # Hooks customizados (autocomplete e scroll infinito)
├── pages/             # Telas Home e Details
└── assets/            # Recursos estáticos
```

## ▶️ Como rodar localmente

### Pré-requisitos
- Node.js 18+ (ou versão LTS mais recente)
- npm (instalado com o Node)

### Passos
```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# O Vite exibirá a URL, normalmente http://localhost:5173 ou 5174
```

## 🧪 Scripts úteis

```bash
npm run dev      # Ambiente de desenvolvimento com hot reload
npm run build    # Gera a build de produção
npm run preview  # Sobe a build gerada para validação
```

## 🌀 Como o scroll infinito funciona

1. A API do Google Books aceita um parâmetro `startIndex`. A cada "página" pedimos 20 livros.
2. Quando o usuário se aproxima do final da página, o hook `useInfiniteScroll` dispara uma nova chamada.
3. Os resultados são adicionados ao array atual sem duplicar IDs.
4. Quando a API retorna menos de 20 itens, entendemos que não há mais resultados e o carregamento para.

O documento `SCROLL_INFINITO.md` detalha todo o fluxo caso você queira explicar passo a passo.

## 📸 O que ainda queremos adicionar

- Testes automatizados para garantir a qualidade
- Modal com visualização rápida
- Histórico das últimas buscas

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch com sua feature: `git checkout -b minha-feature`
3. Commit: `git commit -m "feat: minha nova funcionalidade"`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request 😊

## 📄 Licença

Projeto acadêmico para fins de aprendizado. Sinta-se livre para adaptar e evoluir.
