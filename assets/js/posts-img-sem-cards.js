/* =========================================
   CONTEÚDO — VARIANTE ALTERNADA

   Mesma estrutura de posts-img.js, mas só
   com 3 dicas rápidas por post (em vez de 4),
   pra bater com as 3 linhas foto+texto do
   layout alternado (ver script-img-sem-cards.js).

   O campo "texto" de cada dica e o "insight"
   do post aceitam HTML — use
   <span class="destaque">...</span> pra marcar
   um atalho ou palavra-chave (fica branco,
   negrito e em caixa alta, igual ao título) e
   <br> pra separar itens numa lista de atalhos
   dentro da mesma dica.
========================================= */

const posts = [

    // EXCEL
    {
    id: 1,

        categoria: "ATALHOS DO EXCEL",

        titulo:
            "SELEÇÃO RÁPIDA DE DADOS",

        introducao:
            "Selecione dados para cima, para baixo, para os lados ou o bloco inteiro usando poucos atalhos.",

        dicas: [
            // VERTICAL
            {
                numero: "01",
                titulo: "SELEÇÃO VERTICAL",
                texto: "<span class=\"destaque\">Ctrl + Shift + ↓</span> - Seleciona os dados até o final abaixo.<br><span class=\"destaque\">Ctrl + Shift + ↑</span> - Faz o mesmo para cima.<br><span class=\"destaque\">Ctrl + Espaço</span> - Seleciona a coluna inteira."
            },

            // HORIZONTAL
            {
                numero: "02",
                titulo: "SELEÇÃO HORIZONTAL",
                texto: "<span class=\"destaque\">Ctrl + Shift + →</span> - Seleciona os dados até o final à direita.<br><span class=\"destaque\">Ctrl + Shift + ←</span> - Faz o mesmo para a esquerda.<br><span class=\"destaque\">Shift + Espaço</span> - Seleciona a linha inteira."
            },

            // GERAL
            {
                numero: "03",
                titulo: "SELEÇÃO DO BLOCO",
                texto: "<span class=\"destaque\">Ctrl + Shift + Espaço</span> - Seleciona todo o bloco de dados atual.<br><span class=\"destaque\">Ctrl + Shift + seta</span> - Seleciona apenas na direção escolhida."
            }
        ],

        insight:
            "Use <span class=\"destaque\">Ctrl + Shift + seta</span> para selecionar dados em uma direção, <span class=\"destaque\">Espaço</span> para selecionar uma linha ou coluna inteira e <span class=\"destaque\">Ctrl + Shift + Espaço</span> para selecionar o bloco completo.",
    
        autor:
        "@kawan.dev · www.kawandev.com.br"
        },

];
