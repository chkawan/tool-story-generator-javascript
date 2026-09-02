/* =========================================
   CONTEÚDO — VARIANTE COM IMAGEM

   Mesma estrutura de posts.js, mas cada
   post tem só 4 dicas (em vez de 6) e o
   campo "texto" é uma legenda curta — o
   card aqui é dominado pela imagem que o
   usuário envia, não pelo texto.
========================================= */

const posts = [

    // NEGÓCIO
    {
    id: 1,

    categoria: "SOLUÇÕES PARA O SEU NEGÓCIO",

    titulo:
        "O QUE EU POSSO FAZER PELO SEU NEGÓCIO",

    introducao:
        "Do Excel ao sistema completo — eu construo o que seu negócio precisa.",


    dicas: [
        // EXCEL
        {
            numero: "01",
            titulo: "PLANILHAS COMPLETAS",
            texto: "Fórmulas, macros e relatórios automáticos."
        },
        // POWER BI
        {
            numero: "02",
            titulo: "DASHBOARDS INTERATIVOS",
            texto: "Dados viram gráficos fáceis de entender."
        },
        // SISTEMAS
        {
            numero: "03",
            titulo: "SISTEMAS SOB MEDIDA",
            texto: "Sistema feito sob medida pra sua operação."
        },
        // AUTOMAÇÃO
        {
            numero: "04",
            titulo: "AUTOMAÇÃO DE TAREFAS",
            texto: "Tarefas repetitivas rodando sozinhas."
        }

    ],


    insight:
        "Você não precisa se adaptar às ferramentas prontas. Eu construo a que se adapta a você."

},

//  EXCEL
{
    id: 2,

    categoria: "PLANILHAS E AUTOMAÇÃO",

    titulo:
        "SUA PLANILHA PODE FAZER MUITO MAIS",

    introducao:
        "Uma planilha bem construída substitui horas de trabalho manual toda semana.",


    dicas: [

        {
            numero: "01",
            titulo: "FÓRMULAS AVANÇADAS",
            texto: "PROCV, condicionais e cálculos automáticos."
        },

        {
            numero: "02",
            titulo: "MACROS E VBA",
            texto: "Um clique faz o que levava horas."
        },

        {
            numero: "03",
            titulo: "RELATÓRIOS AUTOMÁTICOS",
            texto: "A planilha se atualiza e o relatório sai pronto."
        },

        {
            numero: "04",
            titulo: "PAINÉIS E GRÁFICOS",
            texto: "Indicadores visuais direto na planilha."
        }

    ],


    insight:
        "Planilha não é só número em célula — é ferramenta de decisão, quando bem construída."

},

// POWER BI
{
    id: 3,

    categoria: "POWER BI E ANÁLISE DE DADOS",

    titulo:
        "SEUS DADOS MERECEM UM DASHBOARD DE VERDADE",

    introducao:
        "Do dado bruto ao painel interativo — assim eu construo dashboards em Power BI.",


    dicas: [

        {
            numero: "01",
            titulo: "CONEXÃO DE DADOS",
            texto: "Excel, SQL, APIs — tudo em um só lugar."
        },

        {
            numero: "02",
            titulo: "MODELAGEM E DAX",
            texto: "Relações e cálculos que fazem sentido pro negócio."
        },

        {
            numero: "03",
            titulo: "DASHBOARDS INTERATIVOS",
            texto: "Filtros, gráficos e indicadores em tempo real."
        },

        {
            numero: "04",
            titulo: "ATUALIZAÇÃO AUTOMÁTICA",
            texto: "O painel se atualiza sozinho, sempre com dado novo."
        }

    ],


    insight:
        "Dashboard bom não é bonito só de olhar — é rápido de entender e fácil de decidir."

},
// SISTEMAS SOB MEDIDA
{
    id: 4,

    categoria: "SISTEMAS SOB MEDIDA",

    titulo:
        "SEU NEGÓCIO MERECE UM SISTEMA SOB MEDIDA",

    introducao:
        "Nada de se adaptar a um sistema pronto — o sistema se adapta ao seu processo.",


    dicas: [

        {
            numero: "01",
            titulo: "ENTENDER O PROCESSO",
            texto: "Antes de programar, eu entendo como você trabalha."
        },

        {
            numero: "02",
            titulo: "BANCO DE DADOS",
            texto: "Dados organizados do jeito certo, desde o início."
        },

        {
            numero: "03",
            titulo: "INTERFACE SOB MEDIDA",
            texto: "Telas pensadas pra quem realmente vai usar."
        },

        {
            numero: "04",
            titulo: "PERMISSÕES E ACESSOS",
            texto: "Cada usuário vê e faz só o que deveria."
        }

    ],


    insight:
        "Sistema pronto resolve problema genérico. Sistema sob medida resolve o SEU problema."

},

// AUTOMAÇÃO DE PROCESSOS

{
    id: 5,

    categoria: "AUTOMAÇÃO DE TAREFAS",

    titulo:
        "SEU TEMPO VALE MAIS QUE TAREFA REPETITIVA",

    introducao:
        "Se você faz a mesma coisa toda semana, provavelmente dá pra automatizar.",


    dicas: [

        {
            numero: "01",
            titulo: "TAREFAS REPETITIVAS",
            texto: "Copiar, colar e digitar sem parar? Isso automatiza."
        },

        {
            numero: "02",
            titulo: "INTEGRAÇÃO DE SISTEMAS",
            texto: "Ferramentas diferentes conversando sozinhas."
        },

        {
            numero: "03",
            titulo: "NOTIFICAÇÕES AUTOMÁTICAS",
            texto: "Alertas certos, na hora certa, sem alguém lembrar."
        },

        {
            numero: "04",
            titulo: "ROTINAS AGENDADAS",
            texto: "Relatório e backup rodando no horário certo."
        }

    ],


    insight:
        "Automatizar não é sobre substituir pessoas — é sobre parar de desperdiçar o tempo delas."

}


];
