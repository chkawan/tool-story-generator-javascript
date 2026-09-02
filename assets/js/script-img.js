/* =========================================
   CONFIGURAÇÃO
========================================= */

let currentPostIndex = 0;


/* =========================================
   ELEMENTOS
========================================= */

const postSelector =
    document.getElementById("postSelector");

const previousButton =
    document.getElementById("previousPost");

const nextButton =
    document.getElementById("nextPost");

const exportButton =
    document.getElementById("exportButton");

const postCategory =
    document.getElementById("postCategory");

const postTitle =
    document.getElementById("postTitle");

const postIntro =
    document.getElementById("postIntro");

const postCards =
    document.getElementById("postCards");

const postInsight =
    document.getElementById("postInsight");

/*
Sem #postAuthor — "@kawan.dev • www.kawandev.
com.br" é gerado via ::after no style-img.css
(não muda por post), então não tem elemento
HTML nem o que ler/escrever nele em JS.
*/

const story =
    document.getElementById("story");

const previewLabel =
    document.getElementById("previewLabel");

const settingsToggle =
    document.getElementById("settingsToggle");

const settingsOverlay =
    document.getElementById("settingsOverlay");

const settingsPanel =
    document.getElementById("settingsPanel");

const settingsClose =
    document.getElementById("settingsClose");

const settingsBody =
    document.getElementById("settingsBody");

const settingsReset =
    document.getElementById("settingsReset");

const heroLogo =
    document.getElementById("heroLogo");

const heroLogoRemove =
    document.getElementById("heroLogoRemove");

const cardImageInput =
    document.getElementById("cardImageInput");


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
        Precisa carregar as configurações ANTES
        do primeiro renderPost() — é de lá que
        vem o post que estava aberto da última
        vez (currentSettings.postIndex). Se
        carregasse depois (como initSettingsPanel
        fazia sozinho), a releitura reatribuía
        currentSettings e derrubava o índice que
        acabou de ser aplicado.
        */

        currentSettings =
            loadSettingsFromStorage();

        if (
            currentSettings.postIndex !== undefined &&
            posts[currentSettings.postIndex]
        ) {

            currentPostIndex =
                currentSettings.postIndex;

        }


        loadPostSelector();

        renderPost(currentPostIndex);

        initSettingsPanel();

        initCardImageUpload();

    }
);


/* =========================================
   CRIA SELECT DOS POSTS
========================================= */

function loadPostSelector() {

    postSelector.innerHTML = "";


    posts.forEach(
        (post, index) => {

            const option =
                document.createElement("option");


            option.value = index;


            option.textContent =
                `#${String(post.id).padStart(2, "0")} — ${post.titulo}`;


            postSelector.appendChild(option);

        }
    );


    postSelector.value =
        currentPostIndex;
}


/* =========================================
   RENDERIZA POST

   Cada card aqui é: área de imagem (grande,
   clicável) + número + título curto. Sem o
   parágrafo longo da variante original — só
   uma legenda pequena e opcional.
========================================= */

function renderPost(index) {

    if (!posts[index]) {
        return;
    }


    currentPostIndex = index;

    /*
    Salva qual post estava aberto — sem isso,
    recarregar a página sempre voltava pro
    #01, mesmo se você estivesse no #03.
    */

    currentSettings.postIndex =
        index;

    saveSettingsToStorage();


    const post =
        posts[index];


    /* -------------------------
       TEXTOS
    ------------------------- */

    postCategory.textContent =
        post.categoria;


    postTitle.textContent =
        post.titulo;


    postIntro.textContent =
        post.introducao;


    postInsight.textContent =
        post.insight;


    /* -------------------------
       CARDS
    ------------------------- */

    postCards.innerHTML = "";


    post.dicas.forEach(
        (dica, cardIndex) => {

            const card =
                document.createElement("article");


            card.className =
                "card";


            const captionHTML =
                dica.texto ?
                    `<p class="caption">${escapeHTML(dica.texto)}</p>` :
                    "";


            card.innerHTML = `

                <div class="card-image-wrap" data-card-index="${cardIndex}">

                    <div class="card-image-placeholder">
                        <span class="plus">+</span>
                        <span>Adicionar imagem</span>
                    </div>

                    <button
                        type="button"
                        class="card-image-remove"
                        data-card-index="${cardIndex}"
                        aria-label="Remover imagem"
                    >✕</button>

                </div>

                <div class="card-body">

                    <div class="number">
                        ${escapeHTML(dica.numero)}
                    </div>

                    <h2>
                        ${escapeHTML(dica.titulo)}
                    </h2>

                    ${captionHTML}

                </div>

            `;


            postCards.appendChild(card);

        }
    );


    applyCardImages();


    /* -------------------------
       SELECT
    ------------------------- */

    postSelector.value =
        currentPostIndex;


    updateNavigation();

}


/* =========================================
   NAVEGAÇÃO
========================================= */

previousButton.addEventListener(
    "click",
    () => {

        if (currentPostIndex > 0) {

            renderPost(
                currentPostIndex - 1
            );

        }

    }
);


nextButton.addEventListener(
    "click",
    () => {

        if (
            currentPostIndex <
            posts.length - 1
        ) {

            renderPost(
                currentPostIndex + 1
            );

        }

    }
);


postSelector.addEventListener(
    "change",
    (event) => {

        renderPost(
            Number(event.target.value)
        );

    }
);


/* =========================================
   ATUALIZA NAVEGAÇÃO
========================================= */

function updateNavigation() {

    previousButton.disabled =
        currentPostIndex === 0;


    nextButton.disabled =
        currentPostIndex ===
        posts.length - 1;

}


/* =========================================
   IMAGENS DOS CARDS

   Diferente da logo, as imagens dos cards
   são "por posição" (Card 1, 2, 3, 4) e
   valem pra qualquer post selecionado — é
   o mesmo modelo usado pelas fontes/cores
   do painel (configuração global, não por
   post).
========================================= */

const CARD_IMAGE_COUNT =
    4;

const CARD_IMAGE_MAX_FILE_SIZE =
    5 * 1024 * 1024;

let activeCardImageIndex =
    null;


function applyCardImages() {

    const wraps =
        postCards.querySelectorAll(
            ".card-image-wrap"
        );

    wraps.forEach(
        (wrap) => {

            const cardIndex =
                Number(wrap.dataset.cardIndex);

            const dataUrl =
                currentSettings.cardImages &&
                currentSettings.cardImages[cardIndex];

            if (dataUrl) {

                /*
                background-image, não <img src>
                — ver comentário em .card-image-wrap
                no style-img.css sobre o bug do
                html2canvas com object-fit.
                */

                wrap.style.backgroundImage =
                    `url("${dataUrl}")`;

                wrap.classList.add("has-image");

            }

            else {

                wrap.style.backgroundImage =
                    "";

                wrap.classList.remove("has-image");

            }

        }
    );

}


function openCardImagePicker(cardIndex) {

    activeCardImageIndex =
        cardIndex;

    cardImageInput.value =
        "";

    cardImageInput.click();

}


function removeCardImage(cardIndex) {

    if (currentSettings.cardImages) {

        delete currentSettings.cardImages[cardIndex];

    }

    applyCardImages();

    saveSettingsToStorage();

}


/*
As imagens chegam direto de IA (ChatGPT etc.) e costumam vir
bem maiores do que o card precisa (1.4MB+, 1024px+). Guardar
isso cru no localStorage estoura a cota do navegador (5-10MB
no total) já na 3ª imagem, e o salvamento falha em silêncio —
foi exatamente o bug de "as duas últimas imagens somem depois
de recarregar". Por isso, toda imagem passa por aqui antes de
ser guardada: redimensiona pro tamanho que realmente é exibido
e recomprime, cortando o peso pra uma fração do original sem
perda visível.

O "format" importa: JPEG não tem canal alfa, então qualquer
fundo transparente (ex.: logo em PNG) vira preto sólido se for
recomprimido como JPEG — foi exatamente o bug do fundo da logo.
Por isso a logo usa "image/png" (preserva transparência) e as
fotos dos cards usam "image/jpeg" (comprime muito mais, e o
card já é preenchido por completo, então não perde nada não
ter alfa ali).

O "maxDimension" de cada chamada não é arbitrário: a exportação
renderiza em 3x (QUALITY_SCALE, lá no exportStory) pra ficar
nítida — se a imagem guardada for menor que "tamanho exibido ×
3", ela é esticada além da resolução real na hora de exportar e
sai borrada. Card chega a ~470px de largura exibido (3x ≈ 1440)
e a logo a 320px (3x ≈ 960) — 1920px (Full HD, o mesmo padrão
usado no post) cobre os dois com folga de sobra, e mesmo assim
cada imagem some menos de 1MB — bem longe do limite do
localStorage.
*/

function resizeImageDataUrl(dataUrl, maxDimension, quality, format = "image/jpeg") {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();

            img.onload = () => {

                let width =
                    img.naturalWidth;

                let height =
                    img.naturalHeight;

                if (width > maxDimension || height > maxDimension) {

                    if (width >= height) {

                        height =
                            Math.round(
                                height * (maxDimension / width)
                            );

                        width =
                            maxDimension;

                    }

                    else {

                        width =
                            Math.round(
                                width * (maxDimension / height)
                            );

                        height =
                            maxDimension;

                    }

                }


                const canvas =
                    document.createElement("canvas");

                canvas.width =
                    width;

                canvas.height =
                    height;

                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                resolve(
                    canvas.toDataURL(
                        format,
                        quality
                    )
                );

            };

            img.onerror = () => {

                reject(
                    new Error(
                        "Não foi possível processar a imagem."
                    )
                );

            };

            img.src =
                dataUrl;

        }
    );

}


function initCardImageUpload() {

    /*
    Delegação de evento: os cards são
    recriados a cada renderPost(), então
    o listener fica no container fixo
    (#postCards), não em cada card.
    */

    postCards.addEventListener(
        "click",
        (event) => {

            const removeButton =
                event.target.closest(
                    ".card-image-remove"
                );

            if (removeButton) {

                removeCardImage(
                    Number(removeButton.dataset.cardIndex)
                );

                return;

            }


            const wrap =
                event.target.closest(
                    ".card-image-wrap"
                );

            if (wrap) {

                openCardImagePicker(
                    Number(wrap.dataset.cardIndex)
                );

            }

        }
    );


    cardImageInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file || activeCardImageIndex === null) {
                return;
            }


            const isAllowedType =
                /^image\/(png|jpeg|webp)$/.test(
                    file.type
                ) ||
                /\.(png|jpe?g|webp)$/i.test(
                    file.name
                );

            if (!isAllowedType) {

                alert(
                    "Formato não suportado. Envie um arquivo PNG, JPEG ou WEBP."
                );

                return;

            }


            if (file.size > CARD_IMAGE_MAX_FILE_SIZE) {

                alert(
                    "Arquivo muito grande. O limite é 5 MB."
                );

                return;

            }


            const cardIndexForThisUpload =
                activeCardImageIndex;

            const reader =
                new FileReader();

            reader.onload = async () => {

                let compressed;

                try {

                    compressed =
                        await resizeImageDataUrl(
                            reader.result,
                            1920,
                            0.92
                        );

                }

                catch (error) {

                    console.error(
                        "Não foi possível processar a imagem:",
                        error
                    );

                    alert(
                        "Não foi possível processar essa imagem. Tente outro arquivo."
                    );

                    return;

                }


                if (!currentSettings.cardImages) {

                    currentSettings.cardImages =
                        {};

                }

                currentSettings.cardImages[cardIndexForThisUpload] =
                    compressed;

                applyCardImages();


                const saved =
                    saveSettingsToStorage();

                if (!saved) {

                    alert(
                        "A imagem apareceu no preview, mas não coube no espaço " +
                        "de salvamento do navegador — ela pode sumir se você " +
                        "recarregar a página. Tente remover alguma outra " +
                        "imagem do post antes de continuar."
                    );

                }

            };

            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================
   PAINEL DE PERSONALIZAÇÃO

   Mesma mecânica da variante original:
   cada item de SETTINGS_FIELDS controla
   uma variável CSS em :root.
========================================= */

const SETTINGS_STORAGE_KEY =
    "flayerimg.settings.v1";


const FORMATS = [

    {
        id: "story",
        label: "Story · 1080 × 1920 (9:16)",
        width: 1080,
        height: 1920
    },

    {
        id: "square",
        label: "Feed quadrado · 1080 × 1080 (1:1)",
        width: 1080,
        height: 1080
    },

    {
        id: "portrait",
        label: "Feed retrato · 1080 × 1350 (4:5)",
        width: 1080,
        height: 1350
    }

];


/*
=====================================================
PRESETS POR FORMATO

Cada formato tem um espaço vertical bem diferente
(1920 / 1080 / 1350), então usar o mesmo padding e as
mesmas fontes do Story nos outros dois faz o conteúdo
se sobrepor. Aqui cada formato define seu próprio
"layout" (paddings, gaps, alturas mínimas) e "fonts"
(tamanho padrão de cada texto) — aplicados sempre que
o formato muda, tanto no CSS quanto nos controles do
painel.

story = os valores ORIGINAIS, intocados — trocar de
formato e voltar pro Story sempre devolve exatamente o
que já era antes de formatos existirem.
=====================================================
*/

const FORMAT_PRESETS = {

    story: {

        layout: {
            "--story-padding-top": "72px",
            "--story-padding-x": "78px",
            "--story-padding-bottom": "55px",
            "--hero-padding-top": "42px",
            "--hero-padding-bottom": "36px",
            "--badge-margin-bottom": "25px",
            "--intro-margin-top": "27px",
            "--cards-gap": "18px",
            "--card-min-height": "260px",
            "--card-image-min-height": "160px",
            "--card-body-padding": "16px 20px 18px",
            "--card-title-line-clamp": "2",
            "--insight-margin-top": "20px",
            "--insight-padding": "25px 30px",
            "--footer-height": "82px",
            "--footer-margin-top": "18px",
            "--footer-padding-top": "20px"
        },

        fonts: {
            badgeFontSize: 15,
            titleFontSize: 68,
            introFontSize: 22,
            cardNumberFontSize: 20,
            cardTitleFontSize: 34,
            cardCaptionFontSize: 20,
            insightLabelFontSize: 13,
            insightTextFontSize: 21,
            footerFontSize: 22
        }

    },

    square: {

        layout: {
            "--story-padding-top": "36px",
            "--story-padding-x": "40px",
            "--story-padding-bottom": "26px",
            "--hero-padding-top": "18px",
            "--hero-padding-bottom": "12px",
            "--badge-margin-bottom": "12px",
            "--intro-margin-top": "10px",
            "--cards-gap": "10px",
            "--card-min-height": "90px",
            "--card-image-min-height": "40px",
            "--card-body-padding": "6px 12px 7px",
            "--card-title-line-clamp": "1",
            "--insight-margin-top": "10px",
            "--insight-padding": "11px 15px",
            "--footer-height": "34px",
            "--footer-margin-top": "8px",
            "--footer-padding-top": "7px"
        },

        fonts: {
            badgeFontSize: 11,
            titleFontSize: 28,
            introFontSize: 13,
            cardNumberFontSize: 12,
            cardTitleFontSize: 15,
            cardCaptionFontSize: 11,
            insightLabelFontSize: 9,
            insightTextFontSize: 12,
            footerFontSize: 10
        }

    },

    portrait: {

        layout: {
            "--story-padding-top": "48px",
            "--story-padding-x": "56px",
            "--story-padding-bottom": "36px",
            "--hero-padding-top": "26px",
            "--hero-padding-bottom": "20px",
            "--badge-margin-bottom": "16px",
            "--intro-margin-top": "16px",
            "--cards-gap": "13px",
            "--card-min-height": "150px",
            "--card-image-min-height": "75px",
            "--card-body-padding": "9px 14px 10px",
            "--card-title-line-clamp": "1",
            "--insight-margin-top": "13px",
            "--insight-padding": "16px 20px",
            "--footer-height": "52px",
            "--footer-margin-top": "12px",
            "--footer-padding-top": "12px"
        },

        fonts: {
            badgeFontSize: 13,
            titleFontSize: 42,
            introFontSize: 16,
            cardNumberFontSize: 15,
            cardTitleFontSize: 21,
            cardCaptionFontSize: 14,
            insightLabelFontSize: 11,
            insightTextFontSize: 15,
            footerFontSize: 14
        }

    }

};


const SETTINGS_FIELDS = [

    {
        key: "badgeFontSize",
        cssVar: "--badge-font-size",
        group: "Categoria (badge)",
        label: "Tamanho da fonte",
        type: "range",
        min: 10,
        max: 26,
        unit: "px",
        default: 15
    },
    {
        key: "badgeColor",
        cssVar: "--badge-color",
        group: "Categoria (badge)",
        label: "Cor do texto",
        type: "color",
        default: "#B69DFF"
    },

    {
        key: "titleFontSize",
        cssVar: "--title-font-size",
        group: "Título principal",
        label: "Tamanho da fonte",
        type: "range",
        min: 22,
        max: 96,
        unit: "px",
        default: 68
    },
    {
        key: "titleColor",
        cssVar: "--title-color",
        group: "Título principal",
        label: "Cor do texto",
        type: "color",
        default: "#F8FAFC"
    },

    {
        key: "introFontSize",
        cssVar: "--intro-font-size",
        group: "Introdução",
        label: "Tamanho da fonte",
        type: "range",
        min: 11,
        max: 34,
        unit: "px",
        default: 22
    },
    {
        key: "introColor",
        cssVar: "--intro-color",
        group: "Introdução",
        label: "Cor do texto",
        type: "color",
        default: "#94A3B8"
    },

    {
        key: "cardNumberFontSize",
        cssVar: "--card-number-font-size",
        group: "Card — número",
        label: "Tamanho da fonte",
        type: "range",
        min: 10,
        max: 32,
        unit: "px",
        default: 20
    },
    {
        key: "cardNumberColor",
        cssVar: "--card-number-color",
        group: "Card — número",
        label: "Cor do texto (cards ímpares)",
        type: "color",
        default: "#986DFF"
    },

    {
        key: "cardTitleFontSize",
        cssVar: "--card-title-font-size",
        group: "Card — título",
        label: "Tamanho da fonte",
        type: "range",
        min: 13,
        max: 48,
        unit: "px",
        default: 34
    },
    {
        key: "cardTitleColor",
        cssVar: "--card-title-color",
        group: "Card — título",
        label: "Cor do texto",
        type: "color",
        default: "#F8FAFC"
    },

    {
        key: "cardCaptionFontSize",
        cssVar: "--card-caption-font-size",
        group: "Card — legenda",
        label: "Tamanho da fonte",
        type: "range",
        min: 10,
        max: 26,
        unit: "px",
        default: 20
    },
    {
        key: "cardCaptionColor",
        cssVar: "--card-caption-color",
        group: "Card — legenda",
        label: "Cor do texto",
        type: "color",
        default: "#64748B"
    },

    {
        key: "insightLabelFontSize",
        cssVar: "--insight-label-font-size",
        group: "Insight — rótulo",
        label: "Tamanho da fonte",
        type: "range",
        min: 8,
        max: 24,
        unit: "px",
        default: 13
    },
    {
        key: "insightLabelColor",
        cssVar: "--insight-label-color",
        group: "Insight — rótulo",
        label: "Cor do texto",
        type: "color",
        default: "#22D3EE"
    },

    {
        key: "insightTextFontSize",
        cssVar: "--insight-text-font-size",
        group: "Insight — texto",
        label: "Tamanho da fonte",
        type: "range",
        min: 10,
        max: 36,
        unit: "px",
        default: 21
    },
    {
        key: "insightTextColor",
        cssVar: "--insight-text-color",
        group: "Insight — texto",
        label: "Cor do texto",
        type: "color",
        default: "#E2E8F0"
    },

    {
        key: "footerFontSize",
        cssVar: "--footer-font-size",
        group: "Rodapé",
        label: "Tamanho da fonte",
        type: "range",
        min: 10,
        max: 26,
        unit: "px",
        default: 22
    },
    {
        key: "footerColor",
        cssVar: "--footer-color",
        group: "Rodapé",
        label: "Cor do texto (@usuário)",
        type: "color",
        default: "#94A3B8"
    }

];


/*
Logo não segue o padrão genérico de
SETTINGS_FIELDS porque não é um simples
tamanho/cor — envolve upload de arquivo e
arraste no preview. Fica configurada à parte,
igual às imagens dos cards.
*/

/*
offsetX = distância da BORDA DIREITA do
.story (CSS "right"). offsetY = distância do
TOPO do .story (CSS "top"). Os dois são
relativos à página inteira, não à .hero — por
isso o padrão pequeno (30/30) já cai bem na
quina superior direita.
*/

const LOGO_DEFAULTS = {
    width: 200,
    offsetX: 30,
    offsetY: 30,
    opacity: 100
};


const LOGO_MAX_FILE_SIZE =
    3 * 1024 * 1024;


let currentSettings = {};


function loadSettingsFromStorage() {

    try {

        const raw =
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            );

        return raw ?
            JSON.parse(raw) :
            {};

    }

    catch (error) {

        console.error(
            "Não foi possível ler as configurações salvas:",
            error
        );

        return {};

    }

}


function saveSettingsToStorage() {

    try {

        localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify(currentSettings)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Não foi possível salvar as configurações:",
            error
        );

        return false;

    }

}


function getCurrentFormat() {

    const formatId =
        currentSettings.format ||
        FORMATS[0].id;

    return (
        FORMATS.find(
            format => format.id === formatId
        ) ||
        FORMATS[0]
    );

}


function applyFormat(formatId) {

    const format =
        FORMATS.find(
            item => item.id === formatId
        ) ||
        FORMATS[0];


    document.documentElement.style.setProperty(
        "--post-width",
        `${format.width}px`
    );

    document.documentElement.style.setProperty(
        "--post-height",
        `${format.height}px`
    );


    if (previewLabel) {

        previewLabel.textContent =
            `PREVIEW · ${format.width} × ${format.height}`;

    }


    /*
    Aplica o preset de layout (paddings, gaps,
    alturas mínimas) desse formato. O Story usa
    exatamente os valores originais, então
    trocar de formato e voltar não muda nada
    nele.
    */

    const preset =
        FORMAT_PRESETS[format.id];

    if (preset) {

        Object.entries(preset.layout).forEach(
            ([cssVar, value]) => {

                document.documentElement.style.setProperty(
                    cssVar,
                    value
                );

            }
        );

    }

}


/*
Tamanho padrão de cada texto (título, legenda etc.)
quando o usuário não mexeu manualmente naquele campo —
vem do preset do formato atual, e cai pro "default" do
próprio SETTINGS_FIELDS só se o preset não tiver essa
chave (rede de segurança, não deveria acontecer).
*/

function getFieldDefault(field) {

    const preset =
        FORMAT_PRESETS[getCurrentFormat().id];

    if (
        preset &&
        preset.fonts &&
        preset.fonts[field.key] !== undefined
    ) {

        return preset.fonts[field.key];

    }

    return field.default;

}


function applyField(field, value) {

    const unit =
        field.unit ||
        "";

    document.documentElement.style.setProperty(
        field.cssVar,
        `${value}${unit}`
    );

}


function applyLogoSettings() {

    const width =
        currentSettings.logoWidth !== undefined ?
            currentSettings.logoWidth :
            LOGO_DEFAULTS.width;

    const offsetX =
        currentSettings.logoOffsetX !== undefined ?
            currentSettings.logoOffsetX :
            LOGO_DEFAULTS.offsetX;

    const offsetY =
        currentSettings.logoOffsetY !== undefined ?
            currentSettings.logoOffsetY :
            LOGO_DEFAULTS.offsetY;

    const opacity =
        currentSettings.logoOpacity !== undefined ?
            currentSettings.logoOpacity :
            LOGO_DEFAULTS.opacity;


    document.documentElement.style.setProperty(
        "--logo-width",
        `${width}px`
    );

    document.documentElement.style.setProperty(
        "--logo-offset-x",
        `${offsetX}px`
    );

    document.documentElement.style.setProperty(
        "--logo-offset-y",
        `${offsetY}px`
    );

    document.documentElement.style.setProperty(
        "--logo-opacity",
        `${opacity / 100}`
    );


    if (currentSettings.logoDataUrl) {

        heroLogo.src =
            currentSettings.logoDataUrl;

        heroLogo.classList.add("has-logo");

        heroLogoRemove.classList.add("has-logo");

    }

    else {

        heroLogo.removeAttribute("src");

        heroLogo.classList.remove("has-logo");

        heroLogoRemove.classList.remove("has-logo");

    }

}


function removeLogo() {

    delete currentSettings.logoDataUrl;

    applyLogoSettings();

    saveSettingsToStorage();

}


/* =========================================
   MONTA O PAINEL
========================================= */

function buildSettingsPanel() {

    settingsBody.innerHTML =
        "";


    /* -------------------------
       FORMATO DO POST
    ------------------------- */

    const formatGroup =
        document.createElement("div");

    formatGroup.className =
        "settings-group";

    formatGroup.innerHTML = `
        <h3>Formato do post</h3>
        <div class="settings-field">
            <select id="formatSelector"></select>
        </div>
    `;

    settingsBody.appendChild(
        formatGroup
    );


    const formatSelector =
        formatGroup.querySelector(
            "#formatSelector"
        );

    FORMATS.forEach(
        (format) => {

            const option =
                document.createElement("option");

            option.value =
                format.id;

            option.textContent =
                format.label;

            formatSelector.appendChild(
                option
            );

        }
    );

    formatSelector.value =
        getCurrentFormat().id;

    formatSelector.addEventListener(
        "change",
        (event) => {

            currentSettings.format =
                event.target.value;

            /*
            applyAllSettings() (não só applyFormat)
            porque trocar de formato também precisa
            reaplicar o tamanho de fonte padrão de
            cada campo que o usuário não customizou
            — só mexer no layout deixava os campos
            de fonte travados no valor do formato
            anterior até o usuário arrastar aquele
            slider manualmente.
            */

            applyAllSettings();

            saveSettingsToStorage();


            /*
            Reconstrói o painel: os sliders de
            fonte que o usuário não customizou
            precisam mostrar o valor padrão do
            NOVO formato, não o antigo.
            */

            buildSettingsPanel();

        }
    );


    /* -------------------------
       IMAGENS DOS CARDS
    ------------------------- */

    settingsBody.appendChild(
        buildCardImagesGroup()
    );


    /* -------------------------
       LOGO
    ------------------------- */

    settingsBody.appendChild(
        buildLogoGroup()
    );


    /* -------------------------
       CAMPOS AGRUPADOS POR TÓPICO
    ------------------------- */

    const groupNames =
        [...new Set(
            SETTINGS_FIELDS.map(
                field => field.group
            )
        )];

    groupNames.forEach(
        (groupName) => {

            const groupElement =
                document.createElement("div");

            groupElement.className =
                "settings-group";


            const heading =
                document.createElement("h3");

            heading.textContent =
                groupName;

            groupElement.appendChild(
                heading
            );


            SETTINGS_FIELDS
                .filter(
                    field => field.group === groupName
                )
                .forEach(
                    (field) => {

                        groupElement.appendChild(
                            buildFieldControl(field)
                        );

                    }
                );


            settingsBody.appendChild(
                groupElement
            );

        }
    );

}


function buildFieldControl(field) {

    const currentValue =
        currentSettings[field.key] !== undefined ?
            currentSettings[field.key] :
            getFieldDefault(field);


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "settings-field";


    if (field.type === "range") {

        wrapper.innerHTML = `
            <div class="settings-field-label-row">
                <span>${field.label}</span>
                <span class="settings-field-value">${currentValue}${field.unit}</span>
            </div>
            <input
                type="range"
                min="${field.min}"
                max="${field.max}"
                value="${currentValue}"
            >
        `;


        const input =
            wrapper.querySelector("input");

        const valueLabel =
            wrapper.querySelector(
                ".settings-field-value"
            );

        input.addEventListener(
            "input",
            (event) => {

                const value =
                    Number(event.target.value);

                valueLabel.textContent =
                    `${value}${field.unit}`;

                currentSettings[field.key] =
                    value;

                applyField(
                    field,
                    value
                );

                saveSettingsToStorage();

            }
        );

    }

    else if (field.type === "color") {

        wrapper.innerHTML = `
            <div class="settings-field-label-row">
                <span>${field.label}</span>
            </div>
            <input
                type="color"
                value="${currentValue}"
            >
        `;


        const input =
            wrapper.querySelector("input");

        input.addEventListener(
            "input",
            (event) => {

                const value =
                    event.target.value;

                currentSettings[field.key] =
                    value;

                applyField(
                    field,
                    value
                );

                saveSettingsToStorage();

            }
        );

    }


    return wrapper;

}


/* =========================================
   GRUPO DAS IMAGENS DOS CARDS NO PAINEL

   O upload em si acontece clicando direto
   na área de imagem de cada card, no
   preview (ver initCardImageUpload). Aqui
   só ficam dica + botões de remover, pra
   quando não quiser mexer no preview.
========================================= */

function buildCardImagesGroup() {

    const group =
        document.createElement("div");

    group.className =
        "settings-group";

    const removeButtonsHTML =
        Array.from(
            { length: CARD_IMAGE_COUNT },
            (_, index) => `
                <button
                    type="button"
                    class="settings-mini-button"
                    data-remove-card-index="${index}"
                >
                    Remover Card ${index + 1}
                </button>
            `
        ).join("");

    group.innerHTML = `
        <h3>Imagens dos cards</h3>
        <p class="settings-field-hint">
            Clique na área de cada card no preview pra
            enviar uma foto (PNG, JPEG ou WEBP, até 5 MB).
            As imagens valem pela posição do card (1 a 4),
            independente de qual post estiver selecionado.
        </p>
        <div class="settings-inline-actions">
            ${removeButtonsHTML}
        </div>
    `;

    group.querySelectorAll(
        "[data-remove-card-index]"
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    removeCardImage(
                        Number(button.dataset.removeCardIndex)
                    );

                }
            );

        }
    );

    return group;

}


/* =========================================
   GRUPO DA LOGO NO PAINEL
========================================= */

function buildLogoGroup() {

    const currentWidth =
        currentSettings.logoWidth !== undefined ?
            currentSettings.logoWidth :
            LOGO_DEFAULTS.width;

    const currentOffsetX =
        currentSettings.logoOffsetX !== undefined ?
            currentSettings.logoOffsetX :
            LOGO_DEFAULTS.offsetX;

    const currentOffsetY =
        currentSettings.logoOffsetY !== undefined ?
            currentSettings.logoOffsetY :
            LOGO_DEFAULTS.offsetY;

    const currentOpacity =
        currentSettings.logoOpacity !== undefined ?
            currentSettings.logoOpacity :
            LOGO_DEFAULTS.opacity;


    const group =
        document.createElement("div");

    group.className =
        "settings-group";

    group.innerHTML = `
        <h3>Logo (hero, lado direito)</h3>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Enviar imagem</span>
            </div>
            <input
                type="file"
                id="logoUpload"
                accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
            >
            <p class="settings-field-hint">
                SVG, PNG ou JPEG. Até 3 MB.
            </p>
        </div>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Tamanho</span>
                <span class="settings-field-value" id="logoWidthValue">${currentWidth}px</span>
            </div>
            <input
                type="range"
                id="logoWidthRange"
                min="60"
                max="320"
                value="${currentWidth}"
            >
        </div>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Opacidade</span>
                <span class="settings-field-value" id="logoOpacityValue">${currentOpacity}%</span>
            </div>
            <input
                type="range"
                id="logoOpacityRange"
                min="0"
                max="100"
                step="5"
                value="${currentOpacity}"
            >
        </div>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Distância da borda direita</span>
                <span class="settings-field-value" id="logoOffsetXValue">${currentOffsetX}px</span>
            </div>
            <input
                type="range"
                id="logoOffsetXRange"
                min="0"
                max="850"
                step="5"
                value="${currentOffsetX}"
            >
        </div>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Distância do topo</span>
                <span class="settings-field-value" id="logoOffsetYValue">${currentOffsetY}px</span>
            </div>
            <input
                type="range"
                id="logoOffsetYRange"
                min="0"
                max="1600"
                step="5"
                value="${currentOffsetY}"
            >
        </div>

        <div class="settings-field">
            <p class="settings-field-hint">
                Também dá pra arrastar a logo direto no preview.
            </p>
            <div class="settings-inline-actions">
                <button type="button" class="settings-mini-button" id="logoCenterButton">
                    Centralizar posição
                </button>
                <button type="button" class="settings-mini-button" id="logoRemoveButton">
                    Remover logo
                </button>
            </div>
        </div>
    `;


    const uploadInput =
        group.querySelector("#logoUpload");

    uploadInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            const isAllowedType =
                /^image\/(svg\+xml|png|jpeg)$/.test(
                    file.type
                ) ||
                /\.(svg|png|jpe?g)$/i.test(
                    file.name
                );

            if (!isAllowedType) {

                alert(
                    "Formato não suportado. Envie um arquivo SVG, PNG ou JPEG."
                );

                uploadInput.value =
                    "";

                return;

            }


            if (file.size > LOGO_MAX_FILE_SIZE) {

                alert(
                    "Arquivo muito grande. O limite é 3 MB."
                );

                uploadInput.value =
                    "";

                return;

            }


            const isSvg =
                /svg/i.test(file.type) ||
                /\.svg$/i.test(file.name);

            const reader =
                new FileReader();

            reader.onload = async () => {

                let finalDataUrl =
                    reader.result;


                /*
                SVG é vetor — recomprimir como
                JPEG destruiria a nitidez e o
                fundo transparente. Só PNG/JPEG
                passam pela compressão.
                */

                if (!isSvg) {

                    try {

                        finalDataUrl =
                            await resizeImageDataUrl(
                                reader.result,
                                1920,
                                0.9,
                                "image/png"
                            );

                    }

                    catch (error) {

                        console.error(
                            "Não foi possível processar a logo:",
                            error
                        );

                        alert(
                            "Não foi possível processar essa imagem. Tente outro arquivo."
                        );

                        return;

                    }

                }


                currentSettings.logoDataUrl =
                    finalDataUrl;

                applyLogoSettings();


                const saved =
                    saveSettingsToStorage();

                if (!saved) {

                    alert(
                        "A logo apareceu no preview, mas não coube no espaço " +
                        "de salvamento do navegador — ela pode sumir se você " +
                        "recarregar a página."
                    );

                }

            };

            reader.readAsDataURL(
                file
            );

        }
    );


    const widthRange =
        group.querySelector("#logoWidthRange");

    const widthValueLabel =
        group.querySelector("#logoWidthValue");

    widthRange.addEventListener(
        "input",
        (event) => {

            const value =
                Number(event.target.value);

            widthValueLabel.textContent =
                `${value}px`;

            currentSettings.logoWidth =
                value;

            applyLogoSettings();

            saveSettingsToStorage();

        }
    );


    const opacityRange =
        group.querySelector("#logoOpacityRange");

    const opacityValueLabel =
        group.querySelector("#logoOpacityValue");

    opacityRange.addEventListener(
        "input",
        (event) => {

            const value =
                Number(event.target.value);

            opacityValueLabel.textContent =
                `${value}%`;

            currentSettings.logoOpacity =
                value;

            applyLogoSettings();

            saveSettingsToStorage();

        }
    );


    /* -------------------------
       POSIÇÃO — SLIDERS X/Y

       Fazem a mesma coisa que arrastar a
       logo no preview (ver initLogoDrag),
       só que com controle numérico exato.
       Os dois ficam sincronizados: arrastar
       atualiza o valor do slider, e vice
       versa.
    ------------------------- */

    const offsetXRange =
        group.querySelector("#logoOffsetXRange");

    const offsetXValueLabel =
        group.querySelector("#logoOffsetXValue");

    offsetXRange.addEventListener(
        "input",
        (event) => {

            const value =
                Number(event.target.value);

            offsetXValueLabel.textContent =
                `${value}px`;

            currentSettings.logoOffsetX =
                value;

            applyLogoSettings();

            saveSettingsToStorage();

        }
    );


    const offsetYRange =
        group.querySelector("#logoOffsetYRange");

    const offsetYValueLabel =
        group.querySelector("#logoOffsetYValue");

    offsetYRange.addEventListener(
        "input",
        (event) => {

            const value =
                Number(event.target.value);

            offsetYValueLabel.textContent =
                `${value}px`;

            currentSettings.logoOffsetY =
                value;

            applyLogoSettings();

            saveSettingsToStorage();

        }
    );


    group.querySelector(
        "#logoCenterButton"
    ).addEventListener(
        "click",
        () => {

            currentSettings.logoOffsetX =
                LOGO_DEFAULTS.offsetX;

            currentSettings.logoOffsetY =
                LOGO_DEFAULTS.offsetY;

            applyLogoSettings();

            saveSettingsToStorage();


            offsetXRange.value =
                LOGO_DEFAULTS.offsetX;

            offsetXValueLabel.textContent =
                `${LOGO_DEFAULTS.offsetX}px`;

            offsetYRange.value =
                LOGO_DEFAULTS.offsetY;

            offsetYValueLabel.textContent =
                `${LOGO_DEFAULTS.offsetY}px`;

        }
    );

    group.querySelector(
        "#logoRemoveButton"
    ).addEventListener(
        "click",
        () => {

            uploadInput.value =
                "";

            removeLogo();

        }
    );


    return group;

}


/* =========================================
   ARRASTAR A LOGO NO PREVIEW
========================================= */

function syncLogoPositionSliders() {

    const offsetXRange =
        document.getElementById("logoOffsetXRange");

    const offsetYRange =
        document.getElementById("logoOffsetYRange");

    if (offsetXRange) {

        offsetXRange.value =
            currentSettings.logoOffsetX;

        document.getElementById("logoOffsetXValue").textContent =
            `${currentSettings.logoOffsetX}px`;

    }

    if (offsetYRange) {

        offsetYRange.value =
            currentSettings.logoOffsetY;

        document.getElementById("logoOffsetYValue").textContent =
            `${currentSettings.logoOffsetY}px`;

    }

}


function initLogoDrag() {

    heroLogoRemove.addEventListener(
        "click",
        removeLogo
    );


    let dragState =
        null;


    heroLogo.addEventListener(
        "pointerdown",
        (event) => {

            if (!heroLogo.classList.contains("has-logo")) {
                return;
            }


            dragState = {
                startX: event.clientX,
                startY: event.clientY,
                baseOffsetX:
                    currentSettings.logoOffsetX !== undefined ?
                        currentSettings.logoOffsetX :
                        LOGO_DEFAULTS.offsetX,
                baseOffsetY:
                    currentSettings.logoOffsetY !== undefined ?
                        currentSettings.logoOffsetY :
                        LOGO_DEFAULTS.offsetY
            };

            heroLogo.setPointerCapture(
                event.pointerId
            );

        }
    );


    heroLogo.addEventListener(
        "pointermove",
        (event) => {

            if (!dragState) {
                return;
            }


            const deltaX =
                event.clientX - dragState.startX;

            const deltaY =
                event.clientY - dragState.startY;

            /*
            offsetX é CSS "right" (distância da
            borda direita) — arrastar o mouse
            pra direita precisa DIMINUIR essa
            distância, por isso o sinal invertido.
            offsetY é CSS "top" normal, então
            arrastar pra baixo só soma mesmo.
            */

            currentSettings.logoOffsetX =
                Math.round(dragState.baseOffsetX - deltaX);

            currentSettings.logoOffsetY =
                Math.round(dragState.baseOffsetY + deltaY);


            document.documentElement.style.setProperty(
                "--logo-offset-x",
                `${currentSettings.logoOffsetX}px`
            );

            document.documentElement.style.setProperty(
                "--logo-offset-y",
                `${currentSettings.logoOffsetY}px`
            );


            /*
            Mantém os sliders do painel
            sincronizados com o arraste, caso
            o painel esteja aberto (ou seja
            reaberto depois).
            */

            syncLogoPositionSliders();

        }
    );


    heroLogo.addEventListener(
        "pointerup",
        (event) => {

            if (!dragState) {
                return;
            }

            dragState =
                null;

            heroLogo.releasePointerCapture(
                event.pointerId
            );

            saveSettingsToStorage();

        }
    );

}


/* =========================================
   APLICA TODAS AS CONFIGURAÇÕES SALVAS
========================================= */

function applyAllSettings() {

    applyFormat(
        getCurrentFormat().id
    );


    SETTINGS_FIELDS.forEach(
        (field) => {

            const value =
                currentSettings[field.key] !== undefined ?
                    currentSettings[field.key] :
                    getFieldDefault(field);

            applyField(
                field,
                value
            );

        }
    );


    applyLogoSettings();

    applyCardImages();

}


/* =========================================
   ABRE / FECHA O PAINEL
========================================= */

function openSettingsPanel() {

    settingsPanel.classList.add("open");

    settingsOverlay.classList.add("open");

}


function closeSettingsPanel() {

    settingsPanel.classList.remove("open");

    settingsOverlay.classList.remove("open");

}


/* =========================================
   RESTAURA OS VALORES PADRÃO
========================================= */

function resetSettings() {

    currentSettings =
        {};

    localStorage.removeItem(
        SETTINGS_STORAGE_KEY
    );

    applyAllSettings();

    buildSettingsPanel();

}


/* =========================================
   INICIALIZA O PAINEL
========================================= */

function initSettingsPanel() {

    /*
    currentSettings já foi carregado no
    DOMContentLoaded (precisava vir antes do
    primeiro renderPost — ver comentário lá).
    Recarregar aqui de novo sobrescreveria o
    postIndex que acabou de ser aplicado.
    */

    applyAllSettings();

    buildSettingsPanel();


    settingsToggle.addEventListener(
        "click",
        openSettingsPanel
    );

    settingsClose.addEventListener(
        "click",
        closeSettingsPanel
    );

    settingsOverlay.addEventListener(
        "click",
        closeSettingsPanel
    );

    settingsReset.addEventListener(
        "click",
        resetSettings
    );

    initLogoDrag();

}


/* =========================================
   EXPORTAÇÃO

   Mesmo motor testado da variante original:
   clone isolado em (0,0) pra evitar o fundo
   preto, sem forçar scale:1 (bug do
   html2canvas em telas com escala do
   Windows) e supersampling 3x pra nitidez.
========================================= */

exportButton.addEventListener(
    "click",
    exportStory
);


async function exportStory() {

    try {

        exportButton.classList.add("loading");

        exportButton.innerHTML =
            "⏳ Gerando Story...";

        await wait(300);


        const currentFormat =
            getCurrentFormat();

        const WIDTH =
            currentFormat.width;

        const HEIGHT =
            currentFormat.height;

        /*
        O render em si (html2canvas) fica rápido
        em qualquer escala testada — o CUSTO REAL
        está em gerar o PNG final: quanto mais
        nítido/detalhado o resultado, mais pesado
        o arquivo e mais lento o toBlob() pra
        codificá-lo. Com conteúdo real (4 fotos +
        logo): em 3x fica ~2s (ótimo); em 4x já
        passa de 6s; em 5x passa de 15s. 3x é o
        ponto certo — nítido o bastante sem pagar
        esse custo de tempo.
        */

        const QUALITY_SCALE =
            3;


        const storyElement =
            document.getElementById("story");


        if (!storyElement) {

            throw new Error(
                "Container .story não encontrado."
            );

        }


        const captureClone =
            storyElement.cloneNode(true);


        /*
        Os botões "×" de remover (imagem do
        card e logo) e o aviso "+ Adicionar
        imagem" são interface de edição, não
        fazem parte do post — tira tudo isso
        do clone antes de capturar pra não
        sair no PNG.
        */

        captureClone
            .querySelectorAll(
                ".card-image-remove, .card-image-placeholder, .hero-logo-remove"
            )
            .forEach(
                (element) => {

                    element.remove();

                }
            );


        const captureWrapper =
            document.createElement("div");

        captureWrapper.style.cssText =
            "position:fixed;" +
            "top:0;" +
            "left:0;" +
            "margin:0;" +
            "padding:0;" +
            "z-index:99999;" +
            "pointer-events:none;" +
            "background:#0B1120;";

        captureWrapper.appendChild(
            captureClone
        );

        document.body.appendChild(
            captureWrapper
        );


        let renderedCanvas;

        try {

            renderedCanvas =
                await html2canvas(
                    captureClone,
                    {

                        width: WIDTH,

                        height: HEIGHT,

                        windowWidth: WIDTH,

                        windowHeight: HEIGHT,

                        scrollX: 0,

                        scrollY: 0,

                        backgroundColor:
                            "#0B1120",

                        useCORS: true,

                        allowTaint: false,

                        scale: QUALITY_SCALE,

                        logging: false,

                        x: 0,

                        y: 0

                    }
                );

        }

        finally {

            captureWrapper.remove();

        }


        const finalCanvas =
            document.createElement("canvas");


        finalCanvas.width =
            WIDTH;


        finalCanvas.height =
            HEIGHT;


        const ctx =
            finalCanvas.getContext("2d");


        ctx.imageSmoothingEnabled =
            true;

        ctx.imageSmoothingQuality =
            "high";


        ctx.fillStyle =
            "#0B1120";


        ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );


        ctx.drawImage(
            renderedCanvas,
            0,
            0,
            renderedCanvas.width,
            renderedCanvas.height,
            0,
            0,
            WIDTH,
            HEIGHT
        );


        const post =
            posts[currentPostIndex];


        const filename =
            createFilename(
                post.titulo,
                post.id
            );


        finalCanvas.toBlob(
            (blob) => {

                if (!blob) {

                    throw new Error(
                        "Falha ao gerar PNG."
                    );

                }


                const url =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href =
                    url;


                link.download =
                    filename;


                document.body.appendChild(link);


                link.click();


                link.remove();


                setTimeout(
                    () => {

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    1000
                );

            },
            "image/png"
        );


    }

    catch (error) {

        console.error(
            "Erro na exportação:",
            error
        );


        alert(
            "Erro ao exportar o Story."
        );

    }

    finally {

        exportButton.classList.remove(
            "loading"
        );


        exportButton.innerHTML =
            "<span>⚡</span> Exportar PNG";

    }

}


/* =========================================
   NOME DO ARQUIVO
========================================= */

function createFilename(
    title,
    id
) {

    const cleanTitle =
        title

            .normalize("NFD")

            .replace(
                /[̀-ͯ]/g,
                ""
            )

            .replace(
                /[^a-zA-Z0-9]+/g,
                "-"
            )

            .replace(
                /^-+|-+$/g,
                ""
            )

            .toLowerCase();


    return `story-img-${String(id).padStart(2, "0")}-${cleanTitle}.png`;

}


/* =========================================
   PROTEÇÃO CONTRA HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================================
   DELAY
========================================= */

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}
