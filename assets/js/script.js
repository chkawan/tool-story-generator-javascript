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

const postAuthor =
    document.getElementById("postAuthor");

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


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPostSelector();

        renderPost(currentPostIndex);

        initSettingsPanel();

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
========================================= */

function renderPost(index) {

    if (!posts[index]) {
        return;
    }


    currentPostIndex = index;


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


    postAuthor.textContent =
        post.autor;


    /* -------------------------
       CARDS
    ------------------------- */

    postCards.innerHTML = "";


    post.dicas.forEach(
        (dica) => {

            const card =
                document.createElement("article");


            card.className =
                "card";


            card.innerHTML = `

                <div class="number">
                    ${escapeHTML(dica.numero)}
                </div>

                <h2>
                    ${escapeHTML(dica.titulo)}
                </h2>

                <p>
                    ${escapeHTML(dica.texto)}
                </p>

            `;


            postCards.appendChild(card);

        }
    );


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
   PAINEL DE PERSONALIZAÇÃO

   Cada item de SETTINGS_FIELDS controla uma
   variável CSS (definida em :root, no
   style.css). Mudar um controle no painel
   escreve direto nessa variável — não mexe
   em nenhuma outra regra do CSS.
========================================= */

const SETTINGS_STORAGE_KEY =
    "flayer.settings.v1";


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

Mesma ideia do index-img.html: cada formato tem um
espaço vertical bem diferente (1920 / 1080 / 1350),
então usar o mesmo padding e as mesmas fontes do
Story nos outros dois faz o conteúdo (6 cards com
texto completo, sem imagem) transbordar e empurrar
o insight/rodapé pra fora do canvas. Aqui cada
formato define seu próprio "layout" (paddings, gaps,
alturas mínimas, quantas linhas de título/texto
cabem) e "fonts" — aplicados sempre que o formato
muda, tanto no CSS quanto nos controles do painel.

story = os valores ORIGINAIS, intocados — trocar de
formato e voltar pro Story sempre devolve exatamente
o que já era antes de formatos existirem.
=====================================================
*/

const FORMAT_PRESETS = {

    story: {

        layout: {
            "--story-padding-top": "72px",
            "--story-padding-x": "78px",
            "--story-padding-bottom": "55px",
            "--hero-padding-top": "42px",
            "--hero-padding-bottom": "44px",
            "--badge-margin-bottom": "25px",
            "--intro-margin-top": "27px",
            "--cards-gap": "16px",
            "--card-min-height": "192px",
            "--card-padding": "25px 27px",
            "--card-title-line-clamp": "2",
            "--card-text-line-clamp": "4",
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
            cardTitleFontSize: 36,
            cardTextFontSize: 30,
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
            "--card-min-height": "140px",
            "--card-padding": "14px 16px",
            "--card-title-line-clamp": "1",
            "--card-text-line-clamp": "2",
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
            cardTitleFontSize: 16,
            cardTextFontSize: 13,
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
            "--card-min-height": "175px",
            "--card-padding": "18px 20px",
            "--card-title-line-clamp": "2",
            "--card-text-line-clamp": "3",
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
            cardNumberFontSize: 14,
            cardTitleFontSize: 22,
            cardTextFontSize: 17,
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
        min: 16,
        max: 48,
        unit: "px",
        default: 36
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
        key: "cardTextFontSize",
        cssVar: "--card-text-font-size",
        group: "Card — texto",
        label: "Tamanho da fonte",
        type: "range",
        min: 12,
        max: 40,
        unit: "px",
        default: 30
    },
    {
        key: "cardTextColor",
        cssVar: "--card-text-color",
        group: "Card — texto",
        label: "Cor do texto",
        type: "color",
        default: "#94A3B8"
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
arraste no preview. Fica configurada à parte.
*/

const LOGO_DEFAULTS = {
    width: 120,
    offsetX: 0,
    offsetY: 0
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

    }

    catch (error) {

        console.error(
            "Não foi possível salvar as configurações:",
            error
        );

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
    alturas mínimas, line-clamp) desse formato. O
    Story usa exatamente os valores originais,
    então trocar de formato e voltar não muda nada
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
Tamanho padrão de cada texto (título, cards etc.)
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


    if (currentSettings.logoDataUrl) {

        heroLogo.src =
            currentSettings.logoDataUrl;

        heroLogo.classList.add("has-logo");

    }

    else {

        heroLogo.removeAttribute("src");

        heroLogo.classList.remove("has-logo");

    }

}


/* =========================================
   MONTA O PAINEL (HTML gerado a partir
   de FORMATS + SETTINGS_FIELDS)
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
   GRUPO DA LOGO NO PAINEL

   Upload (SVG/PNG/JPEG), tamanho por slider
   e posição por arraste direto no preview
   (ver initLogoDrag).
========================================= */

function buildLogoGroup() {

    const currentWidth =
        currentSettings.logoWidth !== undefined ?
            currentSettings.logoWidth :
            LOGO_DEFAULTS.width;


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
                max="240"
                value="${currentWidth}"
            >
        </div>

        <div class="settings-field">
            <div class="settings-field-label-row">
                <span>Posição</span>
            </div>
            <p class="settings-field-hint">
                Arraste a logo direto no preview pra reposicionar.
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


    /* -------------------------
       UPLOAD
    ------------------------- */

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


            const reader =
                new FileReader();

            reader.onload = () => {

                currentSettings.logoDataUrl =
                    reader.result;

                applyLogoSettings();

                saveSettingsToStorage();

            };

            reader.readAsDataURL(
                file
            );

        }
    );


    /* -------------------------
       TAMANHO
    ------------------------- */

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


    /* -------------------------
       POSIÇÃO
    ------------------------- */

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

        }
    );

    group.querySelector(
        "#logoRemoveButton"
    ).addEventListener(
        "click",
        () => {

            delete currentSettings.logoDataUrl;

            uploadInput.value =
                "";

            applyLogoSettings();

            saveSettingsToStorage();

        }
    );


    return group;

}


/* =========================================
   ARRASTAR A LOGO NO PREVIEW

   Move a logo com o mouse direto no .story.
   Como o preview é exibido em 1080px reais
   (sem escala de CSS), 1px de mouse = 1px
   de deslocamento — sem conversão.
========================================= */

function initLogoDrag() {

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

            currentSettings.logoOffsetX =
                Math.round(dragState.baseOffsetX + deltaX);

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

    currentSettings =
        loadSettingsFromStorage();


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


        /*
        =====================================================
        1. DIMENSÕES EXATAS DO POST

        Lê o formato escolhido no painel de
        personalização (Story / Feed quadrado /
        Feed retrato) em vez de um valor fixo,
        para exportar sempre no tamanho que está
        sendo mostrado no preview.
        =====================================================
        */

        const currentFormat =
            getCurrentFormat();

        const WIDTH =
            currentFormat.width;

        const HEIGHT =
            currentFormat.height;

        /*
        Renderiza em resolução mais alta que o
        arquivo final (supersampling) e depois
        reduz com suavização — deixa texto e
        bordas bem mais nítidos que renderizar
        já no tamanho final.

        O render em si fica rápido em qualquer
        escala testada (html2canvas sozinho),
        mas o CUSTO REAL está em gerar o PNG
        final: quanto mais nítido/detalhado o
        resultado, mais pesado o arquivo e mais
        lento o toBlob() para codificá-lo — em
        3x isso fica em ~2s (ótimo); em 4x já
        passa de 6s; em 5x passa de 15s. 3x é o
        ponto certo: nítido o bastante (dá pra
        ver a diferença de 1x) sem pagar esse
        custo de tempo.
        */
        const QUALITY_SCALE = 3;


        /*
        =====================================================
        2. GARANTE QUE ESTAMOS CAPTURANDO
           SOMENTE O CONTAINER DO POST
        =====================================================
        */

        const storyElement =
            document.getElementById("story");


        if (!storyElement) {

            throw new Error(
                "Container .story não encontrado."
            );

        }


        /*
        =====================================================
        3. ISOLA O .STORY ANTES DE CAPTURAR

        O html2canvas se confunde ao capturar um elemento
        que não está na origem (0,0) da página — aqui o
        .story fica abaixo do header fixo (sticky) e do
        padding do workspace. Com width/height/windowWidth/
        windowHeight forçados, esse deslocamento faz a
        parte de baixo da imagem sair pintada com a cor de
        fundo da PÁGINA (quase preta) em vez da cor de
        fundo do .story — o "fundo preto" no final do PNG.

        Solução: clonar o .story para um wrapper fixo em
        (0,0), capturar o clone (que está corretamente
        alinhado à origem), e remover o wrapper em seguida.
        =====================================================
        */

        const captureClone =
            storyElement.cloneNode(true);

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


        /*
        =====================================================
        4. RENDERIZA SOMENTE O CLONE ISOLADO DO .STORY
        =====================================================
        */

        let renderedCanvas;

        try {

            renderedCanvas =
                await html2canvas(
                    captureClone,
                    {

                        /*
                        Dimensão física da arte
                        */

                        width: WIDTH,

                        height: HEIGHT,


                        /*
                        Mantém exatamente
                        1080 × 1920
                        */

                        windowWidth: WIDTH,

                        windowHeight: HEIGHT,


                        /*
                        Não considera scroll
                        */

                        scrollX: 0,

                        scrollY: 0,


                        /*
                        Fundo da arte
                        */

                        backgroundColor:
                            "#0B1120",


                        /*
                        Imagens
                        */

                        useCORS: true,

                        allowTaint: false,


                        /*
                        Renderização

                        scale:1 tem um bug conhecido do
                        html2canvas: em telas com escala do
                        Windows (125%, 150%, 200%), forçar
                        exatamente 1 deixa o conteúdo fora
                        de proporção (cortado em cima,
                        espremido embaixo). Qualquer outro
                        valor fixo (testado com 1.5, 2, 3 —
                        inclusive sem bater com o DPR real
                        da tela) renderiza corretamente.

                        Aproveitamos isso para usar um valor
                        alto (QUALITY_SCALE) e melhorar a
                        nitidez — depois reduzimos pro
                        tamanho final no passo 7.
                        */

                        scale: QUALITY_SCALE,

                        logging: false,


                        /*
                        O ponto de captura começa
                        exatamente no elemento.
                        */

                        x: 0,

                        y: 0

                    }
                );

        }

        finally {

            captureWrapper.remove();

        }


        /*
        =====================================================
        5. CRIA O CANVAS FINAL
        =====================================================
        */

        const finalCanvas =
            document.createElement("canvas");


        finalCanvas.width =
            WIDTH;


        finalCanvas.height =
            HEIGHT;


        const ctx =
            finalCanvas.getContext("2d");


        /*
        Suavização de alta qualidade ao reduzir
        o canvas de alta resolução (QUALITY_SCALE)
        para o tamanho final — é isso que deixa
        texto e bordas nítidos em vez de picotados.
        */

        ctx.imageSmoothingEnabled =
            true;

        ctx.imageSmoothingQuality =
            "high";


        /*
        =====================================================
        6. FUNDO
        =====================================================
        */

        ctx.fillStyle =
            "#0B1120";


        ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );


        /*
        =====================================================
        7. COPIA SOMENTE O CONTAINER

        Usa o tamanho REAL do renderedCanvas como origem
        (pode ser maior que 1080×1920 se devicePixelRatio
        for maior que 1) e redimensiona para o destino
        exato de 1080×1920, mantendo a proporção 9:16.
        =====================================================
        */

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


        /*
        =====================================================
        8. GERA PNG
        =====================================================
        */

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
                /[\u0300-\u036f]/g,
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


    return `story-${String(id).padStart(2, "0")}-${cleanTitle}.png`;

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