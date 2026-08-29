# Flyer — Gerador de Stories (kawan.dev)

Ferramenta web client-side para criar Stories e posts de Instagram e exportá-los em PNG prontos para publicar — sem abrir um editor de design. O conteúdo (título, dicas, insight) fica separado do visual: trocar de post é editar um objeto JavaScript, e ajustar fonte, cor, formato e logo é feito num painel lateral, sem tocar em CSS.

## Qual problema ele resolve

Publicar conteúdo com frequência no Instagram — seja conteúdo técnico ou divulgação de serviços — normalmente exige abrir um editor de design a cada novo post. O Flyer elimina essa etapa: o layout já está pronto, o conteúdo vive num arquivo separado (`posts.js`), e o resultado sai direto em PNG, na resolução exata do formato escolhido (Story, feed quadrado ou feed retrato), renderizado em alta qualidade via `html2canvas`.

O projeto tem duas variantes:
- **`index.html`** — Stories orientados a texto (categoria, título, 6 dicas, insight).
- **`index-img.html`** — mesma estrutura, mas com 4 dicas e uma imagem enviada pelo usuário dominando o card, voltado para divulgação de serviços (planilhas, Power BI, sistemas sob medida, automação).

## Stack

- **JavaScript (ES6+)** — lógica do gerador, painel de personalização e exportação
- **HTML5 / CSS3** — estrutura e estilo, com variáveis CSS (`:root`) controladas via JS
- **[html2canvas](https://html2canvas.hertzen.com/) 1.4.1** (via CDN) — captura o post em canvas para gerar o PNG final
- **Web Storage API** (`localStorage`) — persiste as preferências de personalização entre visitas
- **File API** — upload da logo do usuário (SVG, PNG ou JPEG)
- **Pointer Events API** — arraste da logo direto no preview

Sem build step, sem dependências instaladas via `npm` — é HTML/CSS/JS puro, com apenas uma lib carregada por CDN.

## Estrutura de pastas

```
/assets
  /css        → estilos e variáveis de tema (style.css, style-img.css)
  /js         → lógica do gerador e conteúdo dos posts
    posts.js       → conteúdo dos Stories (variante texto)
    posts-img.js   → conteúdo dos Stories (variante com imagem)
    script.js      → painel de personalização + exportação (variante texto)
    script-img.js  → painel de personalização + exportação (variante com imagem)
  /prompt     → prompts prontos para gerar novo conteúdo com IA
    prompt-post.txt      → conteúdo geral (variante texto)
    prompt-post-img.txt  → conteúdo geral (variante com imagem)
index.html      → gerador de Stories em texto
index-img.html  → gerador de Stories com imagem enviada pelo usuário
```

## Como instalar e rodar localmente

Não há dependências para instalar. Basta servir a pasta como arquivos estáticos:

```bash
# qualquer servidor estático funciona, por exemplo:
npx serve .
# ou, com Python:
python -m http.server 8080
```

Depois abra `http://localhost:<porta>/index.html` (ou `index-img.html`) no navegador.

> Abrir o `index.html` direto do disco (`file://`) também funciona na maioria dos navegadores, mas um servidor local evita eventuais bloqueios de CORS ao carregar imagens locais.

## Como usar

1. Escolha um post existente no seletor do topo (ou edite/adicione um novo objeto em `posts.js` — use os prompts em `assets/prompt/` para gerar conteúdo novo com uma IA).
2. Clique em **⚙ Personalizar** para ajustar fonte, cor, formato (Story 9:16, feed quadrado 1:1 ou feed retrato 4:5) e a logo (upload, tamanho e posição por arraste).
3. Clique em **⚡ Exportar PNG** para gerar a imagem final no tamanho exato do formato selecionado.

As preferências de personalização ficam salvas no navegador (`localStorage`) e são restauradas automaticamente na próxima visita.
