import React, { useState, useEffect } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";

/* ═══════════════════════════════════════════════
   ZENVIA AGENTIC AI PLATFORM  v7
   Funil dinâmico por caso de uso
   Exo 2 (títulos) + Nunito Sans (corpo)
   #8E09CF · #EC0886 · #1515CC · #FFD300
   ═══════════════════════════════════════════════ */

const C = {
  // ── PRIMÁRIAS (dominantes) ────────────────────────────────────
  purple:      "#8E09CF",
  pink:        "#EC0886",
  // ── SECUNDÁRIAS (uso moderado) ────────────────────────────────
  blue:        "#1515CC",
  yellow:      "#FFD300",
  // ── DERIVADAS ─────────────────────────────────────────────────
  purpleLight: "#B54AE0",
  pinkLight:   "#F44BAA",
  blueLight:   "#3535EE",
  yellowLight: "#FFE44D",
  purpleSoft:  "#F3E8FF",  // fundo roxo suave
  pinkSoft:    "#FDE8F5",  // fundo rosa suave
  blueSoft:    "#E8EEFF",  // fundo azul suave
  // ── FUNDOS ────────────────────────────────────────────────────
  bg:          "#FFFFFF",  // cards e formulários — branco limpo
  bgPage:      "#F4F0FF",  // fundo de página — lilás suave da Zenvia
  bgSection:   "#EDE5FF",  // seção de destaque
  dark:        "#06000E",  // hero/capa escuro
  dark2:       "#1A0038",  // seções escuras
  // ── TEXTOS ────────────────────────────────────────────────────
  t1:          "#0E0020",  // texto principal — quase preto
  t2:          "#2C0A56",  // texto secundário — roxo escuro
  t3:          "#6D3FA0",  // texto terciário — roxo médio
  t4:          "#A87DC8",  // texto desabilitado
  tWhite:      "#FFFFFF",  // texto em fundos escuros
  // ── CARDS & BORDAS ────────────────────────────────────────────
  card:        "#FFFFFF",  // card branco
  cardAlt:     "#F9F5FF",  // card levemente lilás
  brd:         "rgba(142,9,207,.18)",  // borda padrão
  brdHi:       "rgba(236,8,134,.35)", // borda de destaque
  brdLight:    "rgba(142,9,207,.08)", // borda sutil
  // Compat
  cardHi:      "#F3E8FF",
};

const G = {
  brand:    "linear-gradient(135deg,#8E09CF,#EC0886)",
  brandV:   "linear-gradient(180deg,#8E09CF,#EC0886)",
  hero:     "linear-gradient(140deg,#06000E 0%,#1A0038 55%,#06000E 100%)",
  purple:   "linear-gradient(135deg,#8E09CF,#B54AE0)",
  pink:     "linear-gradient(135deg,#EC0886,#F44BAA)",
  blue:     "linear-gradient(135deg,#1515CC,#3535EE)",
  yellow:   "linear-gradient(135deg,#D4A800,#FFD300)",
  purpleGlow: "radial-gradient(circle,rgba(142,9,207,.18) 0%,transparent 70%)",
  pinkGlow:   "radial-gradient(circle,rgba(236,8,134,.12) 0%,transparent 70%)",
};

const F = { exo:"'Exo 2',sans-serif", nunito:"'Nunito Sans',sans-serif" };

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── TIPOGRAFIA BASE — Nunito Sans como padrão global ── */
html, body {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F4F0FF;
  color: #0E0020;
  overflow-x: hidden;
}

/* ── Exo 2 para títulos e elementos de interface ── */
h1, h2, h3, h4, h5, h6 { font-family: 'Exo 2', sans-serif; }
button { font-family: 'Exo 2', sans-serif; font-weight: 700; }
input, select, textarea { font-family: 'Nunito Sans', sans-serif; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(142,9,207,.35); border-radius: 4px; }

/* ── ANIMAÇÕES ── */
@keyframes zFloat  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
@keyframes zFloatB { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(10px)}  }
@keyframes zSpin   { to{transform:rotate(360deg)} }
@keyframes zPulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes zFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes zFadeIn { from{opacity:0} to{opacity:1} }
@keyframes zSlide  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
`;

// ── MATURITY ─────────────────────────────────────────────────────
const MAT = [
  { level:0, min:0,  max:20,  label:"Manual / Caótico",       cs:"#7B0099" },
  { level:1, min:21, max:40,  label:"Automação Básica",        cs:C.blue    },
  { level:2, min:41, max:60,  label:"Assistência Inteligente", cs:C.yellow  },
  { level:3, min:61, max:80,  label:"IA Operacional",          cs:C.purple  },
  { level:4, min:81, max:100, label:"Agentic Enterprise",      cs:C.pink    },
];

// ── USE CASES ─────────────────────────────────────────────────────
const USE_CASES = [
  {
    id:     "cx",
    icon:   "💬",
    title:  "Reduzir Custo de Atendimento",
    desc:   "Automatizar atendimentos repetitivos, reduzir o tempo de espera e resolver mais no 1º contato com IA Agêntica",
    detail: "Ideal para empresas com contact center ou atendimento digital que buscam automação e eficiência operacional.",
    tags:   ["Contact Center","FAQ AI","Chatbot","Omnichannel"],
    color:  C.purple,
    bg:     "rgba(142,9,207,.12)",
  },
  {
    id:     "processos",
    icon:   "⚙️",
    title:  "Automatizar Processos Internos",
    desc:   "Eliminar trabalho manual e repetitivo com Agentes IA, RPA e orquestração inteligente",
    detail: "Ideal para áreas que realizam tarefas repetitivas, processamento de documentos ou workflows manuais.",
    tags:   ["Processos","RPA","Back-office","Workflow IA"],
    color:  C.blue,
    bg:     "rgba(21,21,204,.12)",
  },
  {
    id:     "bots",
    icon:   "🤖",
    title:  "Evoluir Bots para IA Agêntica",
    desc:   "Transformar chatbots básicos em Agentes IA autônomos, contextuais e inteligentes",
    detail: "Ideal para empresas que já têm bots ou automações e querem evoluir para IA Agêntica de verdade.",
    tags:   ["Chatbot","NLP","AI Agents","Contenção"],
    color:  C.pink,
    bg:     "rgba(236,8,134,.12)",
  },
  {
    id:     "vendas",
    icon:   "📈",
    title:  "Aumentar Vendas e Conversão",
    desc:   "Usar IA Agêntica para qualificar leads, engajar clientes e converter mais com menos custo",
    detail: "Ideal para equipes de vendas e marketing que buscam escalar conversão e personalizar engajamento.",
    tags:   ["Vendas","CRM","Leads","Campanhas IA"],
    color:  C.yellow,
    bg:     "rgba(255,211,0,.12)",
  },
];

// ── BENCHMARK DATA — ATUALIZADO 2025-2026 ────────────────────────
// Score de Maturidade em IA Agêntica & CX Digital (escala 0-100)
// Fontes primárias 2025-2026:
//   McKinsey State of AI Nov 2025 (n=1.993, 105 países):
//     88% usam IA em ≥1 função; só 1/3 escalou; 6% são high performers; 23% escalam agentes
//   Stanford AI Index 2026 (abr 2026):
//     88% adoção organizacional; agentes: 20%→77% em tarefas reais; <10% escalaram em qquer função
//   Gartner AI Maturity Survey Q4/2024 (pub 2025):
//     40% dos apps enterprise terão AI Agents até fim 2026 (vs <5% em 2025)
//     High-maturity orgs: score 4.2–4.5/5; low-maturity: 1.6–2.2/5
//   IDC CIO Playbook 2026 (LATAM, comissionado por Lenovo):
//     Brasil lidera LATAM: 67% em adoção sistêmica; Telecom 76%; Bancos 69%; Manufatura 67%
//     LATAM média: 62% em adoção sistêmica/piloto (vs 39% em 2024)
//   Forrester State of AI 2025 + Predictions 2026:
//     1/3 das empresas vai prejudicar CX com IA mal implantada em 2026
//   IDC Worldwide AI Spending Guide 2026: gasto global IA US$301B em 2026 (+35% YoY)
//
// Metodologia: Percentis P25/P50/P75/P90 por segmento, escala 0-100.
// Calibração Brasil/LATAM via IDC CIO Playbook 2026.
// Valores conservadores — arredondados para baixo em ambiguidade.
// Última atualização: maio 2026. Próxima revisão: novembro 2026.
const BENCH = {
  "Financeiro/Fintech":  { p25:40, p50:57, p75:72, p90:84 },
  "Varejo/eCommerce":    { p25:41, p50:58, p75:73, p90:84 },
  "Telecomunicações":    { p25:48, p50:65, p75:79, p90:87 },
  "Saúde/Healthtech":    { p25:31, p50:47, p75:62, p90:76 },
  "Seguros":             { p25:40, p50:56, p75:71, p90:82 },
  "Utilities/Energia":   { p25:33, p50:50, p75:65, p90:77 },
  "Tecnologia/SaaS":     { p25:55, p50:70, p75:82, p90:91 },
  "Educação":            { p25:34, p50:51, p75:66, p90:78 },
  "Logística":           { p25:35, p50:52, p75:66, p90:78 },
  "Indústria":           { p25:30, p50:46, p75:61, p90:74 },
  "Outro":               { p25:36, p50:52, p75:67, p90:79 },
};
// Contexto LATAM/Brasil — IDC CIO Playbook 2026 + McKinsey Nov 2025
// Brasil: 67% em adoção sistêmica (IDC 2026) → score médio ≈ 52/100
// LATAM:  62% adoção sistêmica (IDC 2026) → score médio ≈ 48/100
// Líderes globais: top 1/3 McKinsey → score ≈ 78; Top 6% high performers → score ≥ 85
const BENCH_LATAM = {
  brasil:  { score: 52, label: "Brasil (média)" },
  latam:   { score: 48, label: "LATAM (média)"  },
  liders:  { score: 78, label: "Líderes Globais" },
  nota: "AI High Performers (top 6%, McKinsey Nov 2025): score ≥ 85 | 88% usam IA, <10% escalaram (Stanford 2026)",
};

// ── QUESTIONS BY USE CASE ─────────────────────────────────────────
const UC_DIMS = {

  cx: [
    {
      id:"cx_volume", label:"Volume & Canais", short:"Canais", color:C.purple,
      qs:[
        { id:"cx_v1", text:"Qual é o volume médio mensal de atendimentos?", w:1.2,
          opts:[{v:15,l:"< 1.000/mês"},{v:40,l:"1K–5K/mês"},{v:60,l:"5K–20K/mês"},{v:80,l:"20K–100K/mês"},{v:100,l:"> 100K/mês"}]},
        { id:"cx_v2", text:"Qual % dos contatos são perguntas repetitivas ou FAQs?", w:1.2,
          opts:[{v:20,l:"Não sabemos"},{v:30,l:"< 20%"},{v:55,l:"20%–40%"},{v:75,l:"40%–60%"},{v:100,l:"> 60%"}]},
        { id:"cx_v3", text:"Como são gerenciados os canais de atendimento hoje?", w:1,
          opts:[{v:0,l:"Canal único (telefone)"},{v:25,l:"2 canais isolados"},{v:55,l:"Múltiplos, visão parcial"},{v:80,l:"Omnichannel com histórico"},{v:100,l:"Omnichannel + contexto IA"}]},
      ],
    },
    {
      id:"cx_operacao", label:"Operação de Atendimento", short:"Operação", color:C.pink,
      qs:[
        { id:"cx_o1", text:"Qual é a duração média dos atendimentos?", w:1.2,
          opts:[{v:10,l:"Não medimos"},{v:25,l:"Mais de 15 minutos"},{v:50,l:"10 a 15 minutos"},{v:75,l:"5 a 10 minutos"},{v:100,l:"Menos de 5 minutos"}]},
        { id:"cx_o2", text:"Qual é a taxa de resolução no 1º contato (sem precisar escalar)?", w:1.2,
          opts:[{v:10,l:"Não medimos"},{v:25,l:"Menos de 50%"},{v:50,l:"50% a 65%"},{v:75,l:"65% a 80%"},{v:100,l:"Mais de 80%"}]},
        { id:"cx_o3", text:"Os processos de atendimento estão documentados?", w:1,
          opts:[{v:0,l:"Nada documentado"},{v:25,l:"Parcialmente"},{v:55,l:"Principais processos"},{v:80,l:"Todos com revisão"},{v:100,l:"Otimizados com melhoria contínua"}]},
        { id:"cx_o4",
          text:"Em qual % dos atendimentos o analista precisa ver a tela do cliente para resolver?",
          hint:"O Zenvia Instant Support captura a tela do produto automaticamente — resolve esse caso e reduz o tempo de atendimento sem intervenção manual.",
          w:1.5,
          opts:[
            {v:100,l:"Não acontece"},
            {v:70, l:"Menos de 10% dos atendimentos"},
            {v:40, l:"10% a 30% — ocorre com frequência"},
            {v:15, l:"30% a 60% — problema recorrente"},
            {v:5,  l:"Mais de 60% — gargalo crítico"},
          ]},
      ],
    },
    {
      id:"cx_dados", label:"Dados & Knowledge Base", short:"Dados", color:C.blue,
      qs:[
        { id:"cx_d1", text:"Existe base de conhecimento documentada para o time de atendimento?", w:1.5,
          opts:[{v:0,l:"Não — conhecimento nas pessoas"},{v:25,l:"Fragmentada em emails"},{v:50,l:"Wiki básico, desatualizado"},{v:75,l:"Base organizada mensalmente"},{v:100,l:"KB estruturada e integrada"}]},
        { id:"cx_d2", text:"O CRM está ativo e com dados atualizados dos clientes?", w:1.2,
          opts:[{v:0,l:"Não temos CRM"},{v:25,l:"CRM com uso inconsistente"},{v:55,l:"CRM usado, dados parciais"},{v:80,l:"CRM completo e atualizado"},{v:100,l:"CRM integrado + analytics"}]},
        { id:"cx_d3", text:"Qual é a qualidade dos dados históricos de atendimento?", w:1,
          opts:[{v:0,l:"Sem dados históricos"},{v:25,l:"Incompletos e inconsistentes"},{v:50,l:"Razoáveis com gaps"},{v:75,l:"Bem estruturados"},{v:100,l:"Auditados e de alta qualidade"}]},
      ],
    },
    {
      id:"cx_tech", label:"Tecnologia & Automação", short:"Tecnologia", color:C.yellow,
      qs:[
        { id:"cx_t1", text:"A plataforma de atendimento possui APIs para integração?", w:1.5,
          opts:[{v:0,l:"Sem APIs — sistemas fechados"},{v:20,l:"APIs existem, sem documentação"},{v:45,l:"Algumas APIs, acesso restrito"},{v:70,l:"APIs com documentação básica"},{v:100,l:"APIs RESTful com Swagger e SLA"}]},
        { id:"cx_t2", text:"Há automação de atendimento implantada hoje?", w:1.2,
          opts:[{v:0,l:"Nenhuma"},{v:25,l:"IVR/URA básico"},{v:45,l:"Templates e bot estático"},{v:70,l:"Bot NLP ou automação via API"},{v:100,l:"Múltiplas automações integradas"}]},
        { id:"cx_t3", text:"Qual é o nível de observabilidade das conversas?", w:1,
          opts:[{v:0,l:"Sem monitoração"},{v:25,l:"Volume e SLA apenas"},{v:50,l:"CSAT e tempo médio — manuais"},{v:75,l:"Dashboard em tempo real"},{v:100,l:"Analytics avançado com IA"}]},
      ],
    },
    {
      id:"cx_gov", label:"Governança & Estratégia", short:"Governança", color:C.purpleLight,
      qs:[
        { id:"cx_g1", text:"Existe política formal de uso de IA aprovada pela empresa?", w:1.5,
          opts:[{v:0,l:"Não existe"},{v:20,l:"Discussões, sem formalização"},{v:45,l:"Política básica"},{v:75,l:"Política aprovada e comunicada"},{v:100,l:"AI Policy madura com treinamento"}]},
        { id:"cx_g2", text:"Há patrocínio e budget executivo para projetos de IA?", w:1.2,
          opts:[{v:0,l:"Nenhum interesse"},{v:25,l:"Interesse, sem budget"},{v:50,l:"Budget pontual"},{v:75,l:"Budget alocado com sponsor"},{v:100,l:"IA é pilar estratégico"}]},
        { id:"cx_g3", text:"Há supervisão humana sobre as automações (HITL)?", w:1,
          opts:[{v:0,l:"Sem supervisão"},{v:25,l:"Só quando há problema"},{v:50,l:"Revisão por amostragem"},{v:75,l:"Monitoramento com alertas"},{v:100,l:"HITL completo com auditoria"}]},
      ],
    },
  ],

  processos: [
    {
      id:"pr_mapeamento", label:"Mapeamento de Processos", short:"Processos", color:C.blue,
      qs:[
        { id:"pr_m1", text:"Os processos que você quer automatizar estão documentados?", w:1.5,
          opts:[{v:0,l:"Nada documentado"},{v:20,l:"Documentação parcial e desatualizada"},{v:45,l:"Principais processos mapeados"},{v:75,l:"Todos documentados com detalhes"},{v:100,l:"Mapeados + métricas de eficiência"}]},
        { id:"pr_m2", text:"Qual é o volume estimado de tarefas manuais e repetitivas por mês?", w:1.2,
          opts:[{v:15,l:"< 500 tarefas"},{v:40,l:"500–2.000"},{v:65,l:"2K–10K"},{v:85,l:"10K–50K"},{v:100,l:"> 50K tarefas/mês"}]},
        { id:"pr_m3", text:"Qual é a complexidade predominante dos processos-alvo?", w:1,
          opts:[{v:20,l:"Muito complexos e únicos"},{v:40,l:"Mix de complexidades"},{v:60,l:"Maioria complexa com alguns simples"},{v:80,l:"Maioria estruturada e repetitiva"},{v:100,l:"Totalmente padronizados e repetitivos"}]},
      ],
    },
    {
      id:"pr_dados", label:"Dados & Qualidade", short:"Dados", color:C.purple,
      qs:[
        { id:"pr_d1", text:"Os dados utilizados nos processos são estruturados?", w:1.5,
          opts:[{v:0,l:"Não estruturados (emails, papéis)"},{v:25,l:"Parcialmente estruturados"},{v:55,l:"Maioria estruturada com gaps"},{v:80,l:"Bem estruturados e consistentes"},{v:100,l:"Dados estruturados e de alta qualidade"}]},
        { id:"pr_d2", text:"Qual é a qualidade dos dados de entrada dos processos?", w:1.2,
          opts:[{v:0,l:"Muito baixa — muitos erros"},{v:25,l:"Baixa com problemas frequentes"},{v:55,l:"Razoável com gaps conhecidos"},{v:80,l:"Boa com auditorias periódicas"},{v:100,l:"Excelente e auditada"}]},
        { id:"pr_d3", text:"Os sistemas que participam dos processos trocam dados entre si?", w:1,
          opts:[{v:0,l:"Não — silos totais"},{v:25,l:"Troca manual (export/import)"},{v:50,l:"Integração parcial"},{v:75,l:"Integrados com alguns gaps"},{v:100,l:"Totalmente integrados e em tempo real"}]},
      ],
    },
    {
      id:"pr_tech", label:"Capacidade Técnica", short:"Tecnologia", color:C.pink,
      qs:[
        { id:"pr_t1", text:"Os sistemas envolvidos possuem APIs disponíveis para integração?", w:1.5,
          opts:[{v:0,l:"Sem APIs — sistemas fechados"},{v:20,l:"APIs existem, sem documentação"},{v:45,l:"Algumas APIs documentadas"},{v:70,l:"APIs disponíveis com documentação"},{v:100,l:"APIs RESTful com Swagger e SLA"}]},
        { id:"pr_t2", text:"Existe time técnico para suportar automações de IA?", w:1.2,
          opts:[{v:0,l:"Sem time técnico interno"},{v:25,l:"TI generalista, sem especialização"},{v:55,l:"Desenvolvedor(es) disponíveis"},{v:80,l:"Time dedicado a automações"},{v:100,l:"Time de IA/dados estruturado"}]},
        { id:"pr_t3", text:"Há experiência prévia com RPA ou automação de processos?", w:1,
          opts:[{v:0,l:"Nenhuma experiência"},{v:25,l:"Pilotos sem sucesso"},{v:55,l:"Algumas automações pontuais"},{v:80,l:"Automações em produção"},{v:100,l:"RPA/automações em escala"}]},
      ],
    },
    {
      id:"pr_gov", label:"Governança & Controle", short:"Governança", color:C.yellow,
      qs:[
        { id:"pr_g1", text:"Existe processo formal de aprovação de novas automações?", w:1.2,
          opts:[{v:0,l:"Sem processo"},{v:25,l:"Aprovação informal"},{v:55,l:"Processo documentado"},{v:80,l:"Change management formal"},{v:100,l:"CI/CD com staging e rollback"}]},
        { id:"pr_g2", text:"Como é feito o controle de qualidade das automações implantadas?", w:1.2,
          opts:[{v:0,l:"Sem controle"},{v:25,l:"Monitoramento reativo"},{v:50,l:"Revisão por amostragem"},{v:75,l:"Monitoramento com alertas"},{v:100,l:"Auditoria contínua + HITL"}]},
        { id:"pr_g3", text:"A empresa trata conformidade de dados (LGPD) nas automações?", w:1,
          opts:[{v:0,l:"LGPD não implementada"},{v:25,l:"Em processo de adequação"},{v:55,l:"Adequada parcialmente"},{v:80,l:"Totalmente adequada, DPO designado"},{v:100,l:"Programa maduro com DPIA"}]},
      ],
    },
    {
      id:"pr_estrategia", label:"Estratégia & Patrocínio", short:"Estratégia", color:C.purpleLight,
      qs:[
        { id:"pr_e1", text:"Existe budget e patrocínio executivo para projetos de automação com IA?", w:1.5,
          opts:[{v:0,l:"Nenhum interesse executivo"},{v:25,l:"Interesse, sem budget"},{v:50,l:"Budget pontual por projeto"},{v:75,l:"Budget alocado com sponsor"},{v:100,l:"IA como iniciativa estratégica"}]},
        { id:"pr_e2", text:"Há metas e KPIs definidos para as automações?", w:1.2,
          opts:[{v:0,l:"Sem metas definidas"},{v:25,l:"Metas vagas"},{v:55,l:"Metas básicas de produtividade"},{v:80,l:"KPIs bem definidos e monitorados"},{v:100,l:"OKRs de automação com revisão periódica"}]},
        { id:"pr_e3", text:"Quais são os principais objetivos com automação de processos?", w:1,
          opts:[{v:20,l:"Não está claro ainda"},{v:40,l:"Redução de custo"},{v:65,l:"Eficiência + custo"},{v:85,l:"Eficiência + custo + qualidade"},{v:100,l:"Transformação operacional completa"}]},
      ],
    },
  ],

  bots: [
    {
      id:"bt_maturidade", label:"Maturidade Atual do Bot", short:"Bot Atual", color:C.pink,
      qs:[
        { id:"bt_m1", text:"Qual tipo de solução de bot/automação você possui hoje?", w:1.5,
          opts:[{v:0,l:"Não tenho bot"},{v:20,l:"IVR/URA básico ou FAQ estático"},{v:45,l:"Bot baseado em regras/fluxo"},{v:70,l:"Bot com NLP básico (intenções simples)"},{v:100,l:"Bot com NLP avançado e integrações"}]},
        { id:"bt_m2", text:"Qual é a taxa de contenção atual (resolução sem transferir ao humano)?", w:1.5,
          opts:[{v:0,l:"Não medimos"},{v:20,l:"< 20%"},{v:40,l:"20%–40%"},{v:65,l:"40%–60%"},{v:90,l:"> 60%"}]},
        { id:"bt_m3", text:"Qual é o NPS/CSAT do bot atual?", w:1,
          opts:[{v:0,l:"Não medimos"},{v:20,l:"Muito baixo — clientes insatisfeitos"},{v:45,l:"Mediano com muitas reclamações"},{v:70,l:"Satisfatório"},{v:100,l:"Positivo — clientes elogiam o bot"}]},
      ],
    },
    {
      id:"bt_dados", label:"Dados & Knowledge Base", short:"Dados", color:C.purple,
      qs:[
        { id:"bt_d1", text:"A base de conhecimento do bot está documentada e atualizada?", w:1.5,
          opts:[{v:0,l:"Sem KB — bot totalmente treinado na mão"},{v:20,l:"KB fragmentada e desatualizada"},{v:45,l:"KB existente com gaps"},{v:75,l:"KB organizada e atualizada"},{v:100,l:"KB estruturada, tagueada e integrada"}]},
        { id:"bt_d2", text:"Há dados históricos de conversas suficientes para retreino e evolução?", w:1.2,
          opts:[{v:0,l:"Sem histórico"},{v:25,l:"< 6 meses de dados"},{v:50,l:"6 meses–1 ano"},{v:75,l:"1–2 anos com dados consistentes"},{v:100,l:"> 2 anos, dados catalogados"}]},
        { id:"bt_d3", text:"Os intents e entities estão mapeados, catalogados e documentados?", w:1,
          opts:[{v:0,l:"Não mapeados"},{v:25,l:"Mapeados informalmente"},{v:55,l:"Mapeamento básico"},{v:80,l:"Bem mapeados e documentados"},{v:100,l:"Taxonomia completa com variações"}]},
      ],
    },
    {
      id:"bt_integracao", label:"Integração & Capacidade Técnica", short:"Integração", color:C.blue,
      qs:[
        { id:"bt_i1", text:"O bot está integrado a sistemas externos (CRM, ERP, plataforma de atendimento)?", w:1.5,
          opts:[{v:0,l:"Sem integração — bot isolado"},{v:25,l:"1 integração básica"},{v:50,l:"Algumas integrações parciais"},{v:75,l:"Integrado ao CRM e atendimento"},{v:100,l:"Totalmente integrado a todos os sistemas"}]},
        { id:"bt_i2", text:"O bot consegue executar ações (não só responder perguntas)?", w:1.5,
          opts:[{v:0,l:"Apenas responde — sem ações"},{v:25,l:"1-2 ações simples"},{v:50,l:"Algumas ações via API"},{v:75,l:"Executa ações em múltiplos sistemas"},{v:100,l:"Execução completa E2E com HITL"}]},
        { id:"bt_i3", text:"Há mecanismo de Human-in-the-Loop (HITL) estruturado?", w:1,
          opts:[{v:0,l:"Sem HITL — bot opera sem supervisão"},{v:25,l:"Escala manual sem critérios"},{v:50,l:"Critérios básicos de escala"},{v:75,l:"Escala inteligente com contexto"},{v:100,l:"HITL completo com auditoria e feedback loop"}]},
      ],
    },
    {
      id:"bt_gov", label:"Governança & Evolução", short:"Governança", color:C.yellow,
      qs:[
        { id:"bt_g1", text:"Existe processo de validação e teste antes de mudanças no bot?", w:1.2,
          opts:[{v:0,l:"Mudanças direto em produção"},{v:25,l:"Teste informal antes de publicar"},{v:55,l:"Homologação básica"},{v:80,l:"Processo formal com staging"},{v:100,l:"CI/CD com testes automatizados"}]},
        { id:"bt_g2", text:"Como é monitorada a qualidade das respostas do bot?", w:1.2,
          opts:[{v:0,l:"Sem monitoração"},{v:25,l:"Só quando cliente reclama"},{v:50,l:"Revisão amostral semanal"},{v:75,l:"Dashboard automático de qualidade"},{v:100,l:"Monitoramento com IA + retreino contínuo"}]},
        { id:"bt_g3", text:"Há estratégia definida para evolução para IA Agêntica?", w:1.5,
          opts:[{v:0,l:"Sem estratégia"},{v:25,l:"Apenas intenção"},{v:50,l:"Plano básico esboçado"},{v:75,l:"Roadmap definido com budget"},{v:100,l:"Estratégia aprovada e em execução"}]},
      ],
    },
  ],

  vendas: [
    {
      id:"vd_dados", label:"Base de Dados de Clientes", short:"Dados CRM", color:C.yellow,
      qs:[
        { id:"vd_d1", text:"Há CRM ativo com dados estruturados de leads e clientes?", w:1.5,
          opts:[{v:0,l:"Sem CRM — usamos planilhas"},{v:25,l:"CRM com uso inconsistente"},{v:55,l:"CRM usado, dados parciais"},{v:80,l:"CRM completo e atualizado"},{v:100,l:"CRM integrado + segmentação avançada"}]},
        { id:"vd_d2", text:"Qual é a qualidade e atualização dos dados da base de clientes?", w:1.2,
          opts:[{v:0,l:"Dados desatualizados e incompletos"},{v:25,l:"Qualidade baixa com muitos erros"},{v:55,l:"Razoável com gaps conhecidos"},{v:80,l:"Boa com revisões periódicas"},{v:100,l:"Dados auditados, completos e ricos"}]},
        { id:"vd_d3", text:"A base está segmentada para abordagens e campanhas personalizadas?", w:1,
          opts:[{v:0,l:"Sem segmentação"},{v:25,l:"Segmentação básica (ex: por produto)"},{v:55,l:"Segmentação por perfil comportamental"},{v:80,l:"Segmentação avançada com scores"},{v:100,l:"Micro-segmentação com IA em tempo real"}]},
      ],
    },
    {
      id:"vd_processo", label:"Processo de Vendas & Marketing", short:"Processo", color:C.purple,
      qs:[
        { id:"vd_p1", text:"O processo de vendas está documentado (playbook, script, jornada)?", w:1.5,
          opts:[{v:0,l:"Sem documentação"},{v:25,l:"Processo informal na cabeça dos vendedores"},{v:55,l:"Documentação básica"},{v:80,l:"Playbook completo"},{v:100,l:"Playbook + scripts + métricas por etapa"}]},
        { id:"vd_p2", text:"Como são gerenciados e distribuídos os leads hoje?", w:1.2,
          opts:[{v:0,l:"Sem gestão — ad hoc"},{v:25,l:"Distribuição manual sem critério"},{v:50,l:"Fila simples por disponibilidade"},{v:75,l:"Roteamento por perfil do lead"},{v:100,l:"Lead scoring automático + roteamento IA"}]},
        { id:"vd_p3", text:"Há automação de follow-up e nurturing de leads?", w:1,
          opts:[{v:0,l:"Nenhuma automação"},{v:25,l:"Emails manuais"},{v:50,l:"Email automático básico"},{v:75,l:"Sequências multi-canal automatizadas"},{v:100,l:"Nurturing personalizado por IA em todos os canais"}]},
      ],
    },
    {
      id:"vd_canais", label:"Canais de Engajamento", short:"Canais", color:C.pink,
      qs:[
        { id:"vd_c1", text:"Quais canais são usados para prospecção e engajamento?", w:1.2,
          opts:[{v:20,l:"Apenas 1 canal (ex: só telefone)"},{v:40,l:"2 canais sem integração"},{v:60,l:"3+ canais parcialmente integrados"},{v:80,l:"Multi-canal com histórico unificado"},{v:100,l:"Omnichannel com contexto de IA"}]},
        { id:"vd_c2", text:"Há campanhas ativas de engajamento (WhatsApp, Email, SMS)?", w:1.2,
          opts:[{v:0,l:"Sem campanhas ativas"},{v:25,l:"Campanhas manuais esporádicas"},{v:50,l:"Campanhas regulares, sem automação"},{v:75,l:"Campanhas automatizadas com templates"},{v:100,l:"Campanhas personalizadas + IA de otimização"}]},
        { id:"vd_c3", text:"A empresa possui estratégia de personalização de comunicação?", w:1,
          opts:[{v:0,l:"Comunicação genérica para todos"},{v:25,l:"Personalização básica (nome)"},{v:50,l:"Segmentação por perfil"},{v:75,l:"Personalização por comportamento"},{v:100,l:"Hiper-personalização em tempo real com IA"}]},
      ],
    },
    {
      id:"vd_analytics", label:"Analytics & Performance", short:"Analytics", color:C.blue,
      qs:[
        { id:"vd_a1", text:"Há acompanhamento estruturado do funil de conversão com métricas?", w:1.5,
          opts:[{v:0,l:"Sem funil definido"},{v:25,l:"Funil básico sem dados"},{v:50,l:"Métricas básicas em planilha"},{v:75,l:"Dashboard de funil em tempo real"},{v:100,l:"Funil com IA preditiva e alertas"}]},
        { id:"vd_a2", text:"KPIs de vendas e marketing são monitorados e usados para decisão?", w:1.2,
          opts:[{v:0,l:"Sem KPIs definidos"},{v:25,l:"KPIs vagos sem acompanhamento"},{v:55,l:"KPIs monitorados manualmente"},{v:80,l:"Dashboard automático com alertas"},{v:100,l:"KPIs + IA para recomendação de ações"}]},
        { id:"vd_a3", text:"Existem metas claras de ROI vinculadas a iniciativas de IA?", w:1,
          opts:[{v:0,l:"Sem metas de ROI"},{v:25,l:"Metas vagas"},{v:55,l:"Metas básicas de custo/conversão"},{v:80,l:"OKRs definidos com revisão"},{v:100,l:"ROI por iniciativa + projeções com IA"}]},
      ],
    },
  ],
};

// ── ZENVIA CUSTOMER CLOUD (ZCC) — PORTFÓLIO COMPLETO ─────────────
// ZCC = Zenvia Customer Cloud: plataforma integrada para Atrair,
// Converter, Servir e evoluir para IA Agêntica.
// NLU não é do ZCC, mas tem interop nativa com ZCC e Movidesk.
const PRODUCTS = {
  cx: [
    {
      icon:"🤖", name:"ZCC Chatbot",
      desc:"Bot inteligente com NLP: automatiza o fluxo de atendimento, resolve FAQs, tria e direciona o cliente ao grupo correto com contexto completo da conversa.",
      level:1, badge:"QUICK WIN", color:C.yellow,
    },
    {
      icon:"🔍", name:"Zenvia Instant Support",
      desc:"Agente N1/N2 que captura a tela do produto do cliente automaticamente, acessa base de conhecimento via RAG, diagnostica via APIs e decide: resolver, escalar com contexto completo ou acionar handover. Elimina o gargalo de pedir acesso visual à tela do cliente.",
      level:2, badge:"HIGH IMPACT", color:C.pink,
    },
    {
      icon:"🎯", name:"ZCC Servir",
      desc:"Atendimento humano com bot de triagem e roteamento inteligente. Para SMB/Mid: plataforma ágil sem complexidade enterprise. Para Enterprise: integrado ao Movidesk (tickets, SLA e KB) — ofertado de forma personalizada conforme a necessidade.",
      level:2, badge:"QUICK WIN", color:C.purple,
    },
    {
      icon:"🔗", name:"NLU (interop ZCC)",
      desc:"Fluxos de chatbot complexos e LLMs personalizadas via interop nativa com ZCC. SMB/Mid: NLU + ZCC. Enterprise ou casos complexos: NLU + ZCC + Movidesk. Escolha depende da complexidade e necessidade do projeto.",
      level:3, badge:"HIGH IMPACT", color:C.blue,
    },
    {
      icon:"⚡", name:"Zenvia AI Agents",
      desc:"Agentes IA autônomos que executam jornadas de ponta a ponta com supervisão humana (HITL). Integram ao ZCC para resolver casos complexos sem intervenção humana.",
      level:3, badge:"COMPLEX", color:C.purpleLight,
    },
    {
      icon:"🔀", name:"Zenvia Orchestrator",
      desc:"Orquestração multi-agente: coordena múltiplos Agentes IA especializados por intenção, canal e jornada — tudo integrado ao ecossistema ZCC.",
      level:4, badge:"COMPLEX", color:C.pinkLight,
    },
  ],
  processos: [
    {
      icon:"🎯", name:"ZCC Servir + Movidesk",
      desc:"Para processos que envolvem clientes ou times internos: gestão de tickets, SLAs, triagem automatizada e knowledge base. Movidesk é ofertado de forma personalizada conforme o caso de uso do cliente.",
      level:1, badge:"FOUNDATION", color:C.yellow,
    },
    {
      icon:"🔗", name:"NLU (interop ZCC)",
      desc:"Cria fluxos de automação complexos conectados a sistemas externos (ERPs, CRMs, bases de dados). Conecta LLMs personalizadas com interop nativa ao ZCC e Movidesk para casos de uso específicos do cliente.",
      level:2, badge:"HIGH IMPACT", color:C.blue,
    },
    {
      icon:"🔍", name:"Zenvia Instant Support",
      desc:"Para automação de suporte técnico interno: diagnostica sistemas via APIs internas, acessa documentação RAG e faz handover inteligente com contexto completo para o time de TI ou operações.",
      level:2, badge:"QUICK WIN", color:C.pink,
    },
    {
      icon:"⚡", name:"Zenvia AI Agents",
      desc:"Agentes IA para execução autônoma de tarefas e processos de negócio — desde triagem até resolução completa com HITL.",
      level:2, badge:"HIGH IMPACT", color:C.purple,
    },
    {
      icon:"🔀", name:"Zenvia Orchestrator",
      desc:"Orquestração de múltiplos agentes especializados por tipo de processo, com supervisão centralizada e auditoria completa.",
      level:3, badge:"COMPLEX", color:C.pink,
    },
  ],
  bots: [
    {
      icon:"🤖", name:"ZCC Chatbot (evolução)",
      desc:"Upgrade do bot atual: adiciona NLP avançado, contexto de conversa, integração com sistemas externos e escalada inteligente. Base para a jornada de evolução para IA Agêntica.",
      level:1, badge:"QUICK WIN", color:C.purple,
    },
    {
      icon:"🔗", name:"NLU (interop ZCC)",
      desc:"Para bots que precisam de LLMs mais avançadas e personalizadas: conecta modelos de linguagem customizados ao ZCC via interop nativa. Ideal para intents complexos, múltiplos domínios ou volumes altos que exigem modelos proprietários.",
      level:2, badge:"HIGH IMPACT", color:C.blue,
    },
    {
      icon:"🔍", name:"Zenvia Instant Support",
      desc:"Evolução natural do bot para agente: vê o contexto da tela do cliente, acessa RAG da documentação e executa ações reais em sistemas. Agent-as-a-Judge avalia 100% das interações e aponta gaps para melhoria contínua.",
      level:2, badge:"HIGH IMPACT", color:C.pink,
    },
    {
      icon:"⚡", name:"Zenvia AI Agents",
      desc:"Substitui o bot por Agentes IA autônomos que executam jornadas completas com HITL estruturado e feedback loop para melhoria contínua.",
      level:3, badge:"HIGH IMPACT", color:C.purple,
    },
    {
      icon:"🔀", name:"Zenvia Orchestrator",
      desc:"Multi-agente especializado por cluster de intenções: cada agente resolve um domínio específico, orquestrado de forma inteligente.",
      level:4, badge:"COMPLEX", color:C.yellow,
    },
  ],
  vendas: [
    {
      icon:"📣", name:"ZCC Atrair",
      desc:"Envio de comunicação massiva com ofertas personalizadas — SMS, RCS, WhatsApp, E-mail. Ativa a base de clientes com campanhas segmentadas e mensuráveis para gerar oportunidades.",
      level:1, badge:"QUICK WIN", color:C.yellow,
    },
    {
      icon:"🛒", name:"ZCC Converter",
      desc:"Os interessados compram pelo site ou pelo WhatsApp — seja com bot ou com atendente humano. Jornada de conversão unificada, com histórico e contexto do lead desde o primeiro contato.",
      level:1, badge:"QUICK WIN", color:C.blue,
    },
    {
      icon:"🤖", name:"ZCC Chatbot",
      desc:"Se o lead quiser comprar pelo fluxo do bot, todo o processo é automatizado: qualificação, oferta, negociação e fechamento sem intervenção humana.",
      level:2, badge:"HIGH IMPACT", color:C.purple,
    },
    {
      icon:"🎯", name:"ZCC Servir",
      desc:"Optando pelo atendimento humano, o bot compila as informações da triagem e direciona o lead ao grupo específico de vendas. Integra com Movidesk conforme a complexidade do cliente.",
      level:2, badge:"FOUNDATION", color:C.pink,
    },
    {
      icon:"🔗", name:"NLU (interop ZCC)",
      desc:"Para personalização avançada de jornadas de venda: LLMs customizadas para qualificação de leads, recomendação de produtos e argumentação de vendas via NLU com interop ao ZCC.",
      level:3, badge:"HIGH IMPACT", color:C.blue,
    },
    {
      icon:"⚡", name:"Zenvia AI Agents",
      desc:"Agente de vendas proativo E2E: prospecta, qualifica, faz follow-up e fecha — tudo com personalização por comportamento e histórico do cliente.",
      level:3, badge:"HIGH IMPACT", color:C.pink,
    },
  ],
};

// ── ROADMAPS BY USE CASE ──────────────────────────────────────────
const ROADMAPS = {
  cx:[
    {p:1,name:"Fundação FAQ & Knowledge",time:"0–3 meses",c:C.yellow,kpi:"Deflexão >30% com FAQ AI",items:["Estruturar Knowledge Base (top 100 FAQs)","Implantar Zenvia FAQ AI no WhatsApp","Criar AI Policy básica","Mapeamento de intents por volume"]},
    {p:2,name:"Chatbot Híbrido + Copiloto",time:"3–9 meses",c:C.blue,kpi:"Automação >50%, tempo de atendimento -20%",items:["Chatbot NLP com integração CRM","Copiloto para agentes humanos","Observabilidade de conversas","Capacitação do time em IA"]},
    {p:3,name:"AI Agents Operacionais",time:"9–18 meses",c:C.purple,kpi:"Automação E2E >60%",items:["AI Agents para top 3 jornadas","Voice AI (IVR inteligente)","Analytics preditivo de CX","HITL formal + auditoria de IA"]},
    {p:4,name:"Agentic Enterprise",time:"18–36 meses",c:C.pink,kpi:"Automação >80%",items:["Multi-Agent Orchestration","Data Platform unificado","Responsible AI Framework","CX autônoma e personalizada"]},
  ],
  processos:[
    {p:1,name:"Mapeamento & Quick Wins",time:"0–3 meses",c:C.yellow,kpi:"3 processos documentados e priorizados",items:["Mapear e documentar processos-alvo","Identificar APIs disponíveis","AI Policy básica para automações","Priorizar por ROI e viabilidade"]},
    {p:2,name:"Primeiros Agentes de Processo",time:"3–9 meses",c:C.blue,kpi:"1-3 processos automatizados",items:["AI Agents para processo de maior volume","Integração com sistemas via API","Staging e processo de rollback","Monitoramento e alertas"]},
    {p:3,name:"Escala de Automação",time:"9–18 meses",c:C.purple,kpi:"5-10 processos automáticos",items:["Expansão para novos processos","Orquestração de agentes especializados","Data platform para processos","Governance de IA madura"]},
    {p:4,name:"Orquestração Completa",time:"18–36 meses",c:C.pink,kpi:"Operação autônoma inteligente",items:["Multi-Agent para processos complexos","Self-healing processes","Continuous improvement com IA","Autonomous operations center"]},
  ],
  bots:[
    {p:1,name:"Diagnóstico & Reestruturação",time:"0–2 meses",c:C.yellow,kpi:"KB atualizada + NLP avançado",items:["Auditoria do bot atual","Reestruturar Knowledge Base","Mapear intents com gaps","Definir roadmap de evolução"]},
    {p:2,name:"Bot Inteligente com Ações",time:"2–6 meses",c:C.blue,kpi:"Contenção +20%, execução de ações",items:["Upgrade NLP com modelos modernos","Integração CRM + sistemas core","HITL estruturado com contexto","Monitoring de qualidade automático"]},
    {p:3,name:"AI Agents Substituindo Bot",time:"6–15 meses",c:C.purple,kpi:"AI Agents em produção, contenção >65%",items:["Agentes IA especializados por intenção","Execução E2E das jornadas principais","Feedback loop + retreino contínuo","Testes A/B: bot vs agente"]},
    {p:4,name:"Multi-Agent por Especialidade",time:"15–30 meses",c:C.pink,kpi:"Orquestração multi-agente ativa",items:["Agente por cluster de intenções","Orquestração inteligente de agentes","Personalização por usuário com IA","Continuous learning em produção"]},
  ],
  vendas:[
    {p:1,name:"Base de Dados & CRM",time:"0–3 meses",c:C.yellow,kpi:"CRM atualizado + segmentação básica",items:["Limpeza e enriquecimento do CRM","Segmentação básica da base","Campanha ativa no WhatsApp","Lead scoring manual inicial"]},
    {p:2,name:"Automação de Engajamento",time:"3–8 meses",c:C.blue,kpi:"Follow-up automático, conversão +15%",items:["Campanhas HSM automatizadas Zenvia","Bot de qualificação de leads","Sequências multi-canal de nurturing","Dashboard de funil em tempo real"]},
    {p:3,name:"Agente IA de Vendas",time:"8–18 meses",c:C.purple,kpi:"Agente IA proativo, conversão +30%",items:["AI Agent para prospecção ativa","Lead scoring com ML","Personalização por comportamento","Analytics preditivo de conversão"]},
    {p:4,name:"Hiper-Personalização Agêntica",time:"18–36 meses",c:C.pink,kpi:"CX de vendas autônoma e personalizada",items:["Hiper-personalização em tempo real","Orquestração de jornadas de venda","Pricing dinâmico com IA","Revenue Intelligence Platform"]},
  ],
};

// ── ENGINE ────────────────────────────────────────────────────────
function getMaturity(s) {
  return MAT.find(m => s >= m.min && s <= m.max) || MAT[0];
}

function calcScores(responses, ucId) {
  const dims = UC_DIMS[ucId] || [];
  const dimScores = {};
  dims.forEach(dim => {
    let tw = 0, ws = 0;
    dim.qs.forEach(q => {
      const v = responses[q.id];
      if (v !== undefined) { ws += v * (q.w || 1); tw += (q.w || 1); }
    });
    dimScores[dim.id] = tw > 0 ? ws / tw : 0;
  });
  const totalW = dims.reduce((s, d) => s + 1, 0) || 1;
  const overall = Object.values(dimScores).reduce((s, v) => s + v, 0) / Object.keys(dimScores).length;

  // AI Readiness: data + tech + governance dimensions (find them by convention)
  const dataKey    = Object.keys(dimScores).find(k => k.includes("dado") || k.includes("data")) || "";
  const techKey    = Object.keys(dimScores).find(k => k.includes("tech") || k.includes("integ")) || "";
  const govKey     = Object.keys(dimScores).find(k => k.includes("gov")) || "";
  const aiR_vals   = [dimScores[dataKey] || 0, dimScores[techKey] || 0, dimScores[govKey] || 0];
  let aiR = aiR_vals.reduce((s, v) => s + v, 0) / 3;
  if ((dimScores[dataKey] || 0) < 30) aiR *= 0.7;
  aiR = Math.min(aiR, 100);

  const stratKey   = Object.keys(dimScores).find(k => k.includes("estrategia") || k.includes("processo") || k.includes("maturidade")) || "";
  const agR_vals   = [dimScores[techKey] || 0, dimScores[govKey] || 0, dimScores[stratKey] || 0];
  let agR = agR_vals.reduce((s, v) => s + v, 0) / 3;
  const minAg = Math.min(...agR_vals.filter(v => v > 0));
  if (minAg < 30) agR = Math.min(agR * 0.4, 25);
  else if (minAg < 50) agR = Math.min(agR * 0.7, 50);
  agR = Math.min(agR, 100);

  return {
    overall: Math.round(overall),
    aiR:     Math.round(aiR),
    agR:     Math.round(agR),
    dimScores,
    dims,
    mat: getMaturity(overall),
  };
}

function calcOps(scores) {
  const overall = scores.overall;
  const deflPot  = Math.min(75, Math.max(15, Math.round(overall * 0.7)));
  const tmaRed   = Math.round(overall * 0.35);
  const fcrGain  = Math.round(overall * 0.22);
  const moneySav = Math.round((deflPot / 100) * 50000);
  return { deflPot, tmaRed, fcrGain, moneySaved: moneySav };
}

function getBlockers(scores, ucId) {
  const B = [];
  const ds = scores.dimScores;
  const resp = scores._resp || {};
  if (ucId === "cx") {
    if ((resp.cx_d1 || 0) < 20) B.push({ title:"Sem Knowledge Base", msg:"Sem KB, FAQ AI e chatbot não têm conteúdo seguro para operar.", fix:"Documentar top 100 FAQs em 2–4 semanas" });
    if ((resp.cx_t1 || 0) < 20) B.push({ title:"Sem APIs Disponíveis",  msg:"Sistemas fechados bloqueiam integração de AI Agents.", fix:"Criar layer de API nos sistemas core" });
    if ((resp.cx_g1 || 0) < 20) B.push({ title:"Sem Política de IA",   msg:"Sem AI Policy, soluções autônomas geram risco LGPD.", fix:"AI Policy básica com suporte jurídico em 3–4 semanas" });
  }
  if (ucId === "processos") {
    if ((resp.pr_t1 || 0) < 20) B.push({ title:"Sem APIs nos Sistemas", msg:"Sem APIs, automação de processos depende de RPA frágil.", fix:"Mapear e documentar APIs disponíveis" });
    if ((resp.pr_m1 || 0) < 25) B.push({ title:"Processos Não Mapeados", msg:"Sem documentação, não é possível automatizar com segurança.", fix:"Mapear e documentar processos-alvo antes de qualquer automação" });
    if ((resp.pr_g1 || 0) < 25) B.push({ title:"Sem Governança de Automação", msg:"Sem processo de aprovação, risco de automações incorretas.", fix:"Criar processo básico de change management" });
  }
  if (ucId === "bots") {
    if ((resp.bt_d1 || 0) < 20) B.push({ title:"KB Inexistente ou Defasada", msg:"Sem KB atualizada, upgrade de bot resulta em alucinações.", fix:"Reestruturar KB antes de qualquer evolução" });
    if ((resp.bt_m1 || 0) < 20) B.push({ title:"Sem Bot Base", msg:"Sem bot implantado, começar do zero antes de evoluir para agentes.", fix:"Implantar bot básico como primeiro passo" });
  }
  if (ucId === "vendas") {
    if ((resp.vd_d1 || 0) < 25) B.push({ title:"CRM Inexistente ou Inadequado", msg:"Sem CRM, IA de vendas não tem base de dados para operar.", fix:"Implantar e estruturar CRM antes de qualquer IA" });
    if ((resp.vd_p1 || 0) < 25) B.push({ title:"Processo de Vendas Não Documentado", msg:"Sem playbook, IA vai reproduzir práticas ruins.", fix:"Documentar processo de vendas e playbook antes da IA" });
  }
  return B;
}

async function fetchNarrative(scores, ctx, ucId) {
  const uc = USE_CASES.find(u => u.id === ucId);
  const ucLabel = uc ? uc.title : "Transformação com IA Agêntica";
  try {
    const prompt = "Especialista em CX e IA Agêntica da Zenvia. Gere diagnóstico executivo em 3 parágrafos curtos (máx 3 frases cada) em português brasileiro. SEM títulos, SEM bullets, SEM markdown.\n\n" +
      "Empresa: " + (ctx.name || "N/A") + " | Setor: " + (ctx.industry || "N/A") + "\n" +
      "Objetivo: " + ucLabel + "\n" +
      "Score Geral: " + scores.overall + "/100 — Nível " + scores.mat.level + ": " + scores.mat.label + "\n" +
      "Agentic Readiness: " + scores.agR + "/100\n\n" +
      "§1: Síntese objetiva da maturidade atual para o objetivo '" + ucLabel + "' (cite scores e gaps).\n" +
      "§2: As 2–3 oportunidades mais impactantes e os principais bloqueios a resolver.\n" +
      "§3: Visão do plano de evolução em 12–24 meses — onde essa empresa pode chegar.\n\n" +
      "Tom: consultor especialista Zenvia, estratégico, direto e parceiro de negócio.";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:700, messages:[{role:"user",content:prompt}] }),
    });
    const d = await res.json();
    return d.content && d.content[0] ? d.content[0].text : null;
  } catch(e) {
    return null;
  }
}

function openPDF(scores, ctx, narrative, ucId) {
  const uc = USE_CASES.find(u => u.id === ucId) || USE_CASES[0];
  const { overall, aiR, agR, mat, dims, dimScores } = scores;
  const ops = calcOps(scores);
  const blockers = getBlockers(scores, ucId);
  const roadmap = ROADMAPS[ucId] || ROADMAPS.cx;
  const rawProducts = (PRODUCTS[ucId] || PRODUCTS.cx).slice(0, 4);
  const products = rawProducts.map(p => getProductCtx(p, ctx));
  const dateStr = new Date().toLocaleDateString("pt-BR", { year:"numeric", month:"long", day:"numeric" });
  const isEnterprise = ctx && ctx.size && ctx.size.toLowerCase().includes("enterprise");

  const dimRows = dims.map(d => {
    const s = Math.round(dimScores[d.id] || 0);
    return "<tr><td style='padding:8px 12px;border-bottom:1px solid #eedeff;font-weight:600'>" + d.label + "</td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eedeff'><div style='width:" + Math.round(s * 1.5) + "px;height:7px;background:" + d.color + ";border-radius:4px;min-width:4px'></div></td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eedeff;text-align:center;font-weight:800;color:" + d.color + ";font-family:Exo 2,sans-serif'>" + s + "</td></tr>";
  }).join("");

  const prodRows = products.map(p => {
    const bcColor = p.badge === "QUICK WIN" ? "#FFD300" : p.badge === "HIGH IMPACT" ? "#EC0886" : p.badge === "COMPLEX" ? "#8E09CF" : "#1515CC";
    return "<tr><td style='padding:8px 12px;border-bottom:1px solid #eedeff'>" + p.icon + " <strong>" + p.name + "</strong></td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eedeff;font-size:12px'>" + p.desc + "</td>" +
      "<td style='padding:8px 12px;border-bottom:1px solid #eedeff;text-align:center'><span style='background:" + bcColor + "20;color:" + bcColor + ";padding:3px 9px;border-radius:4px;font-size:10px;font-weight:700'>" + p.badge + "</span></td></tr>";
  }).join("");

  const blkHTML = blockers.length > 0
    ? blockers.map(b => "<div style='margin-bottom:8px;padding:8px 12px;background:#FFF5FF;border-left:3px solid #EC0886;border-radius:4px'>" +
        "<strong style='font-family:Exo 2,sans-serif;color:#EC0886'>" + b.title + "</strong><br/>" +
        "<span style='font-size:11px;color:#4D2080'>" + b.msg + "</span><br/>" +
        "<span style='font-size:11px;color:#8E09CF'>✅ " + b.fix + "</span></div>").join("")
    : "<p style='color:#4D2080'>Nenhum bloqueio crítico identificado. Continue evoluindo!</p>";

  const roadHTML = roadmap.map(ph =>
    "<div style='background:#faf5ff;border-left:4px solid " + ph.c + ";border-radius:8px;padding:12px 16px;margin-bottom:10px'>" +
    "<strong style='font-family:Exo 2,sans-serif'>Fase " + ph.p + ": " + ph.name + " — " + ph.time + "</strong><br/>" +
    "<span style='font-size:11px;color:#7B4FA0'>" + ph.items.join(" • ") + "</span><br/>" +
    "<span style='font-size:11px;font-weight:700;color:" + ph.c + "'>🏁 " + ph.kpi + " </span></div>"
  ).join("");

  const narHTML = narrative
    ? "<div style='background:#faf5ff;border:1px solid #eedeff;border-left:4px solid #8E09CF;border-radius:10px;padding:16px;margin-bottom:16px'>" +
      "<p style='font-size:13px;line-height:1.9;color:#1A0033;white-space:pre-line'>" + narrative + "</p></div>"
    : "";

  const html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Zenvia AI Readiness — " + (ctx.name || "") + "</title>" +
    "<style>@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap');" +
    "*{font-family:'Nunito Sans',sans-serif;box-sizing:border-box;margin:0;padding:0}" +
    "h1,h2,h3,h4,strong{font-family:'Exo 2',sans-serif}" +
    "body{background:#fff;color:#1A0033;font-size:13px;line-height:1.6}" +
    ".page{page-break-after:always;padding:48px;min-height:100vh;position:relative}" +
    ".cover{background:linear-gradient(140deg,#060010 0%,#1C003E 55%,#060010 100%);color:#fff;display:flex;flex-direction:column;justify-content:space-between}" +
    "h2{font-size:20px;font-weight:700;margin-bottom:14px}" +
    ".card{background:#faf5ff;border:1px solid #eedeff;border-radius:10px;padding:16px 20px;margin-bottom:12px}" +
    "table{width:100%;border-collapse:collapse}" +
    "th{background:linear-gradient(135deg,#8E09CF,#EC0886);color:#fff;padding:10px 12px;text-align:left;font-size:12px;font-weight:700}" +
    ".metric{display:inline-block;text-align:center;padding:12px 18px;background:#faf5ff;border:1px solid #eedeff;border-radius:8px;min-width:95px}" +
    ".val{font-size:26px;font-weight:800;font-family:'Exo 2',sans-serif;background:linear-gradient(135deg,#8E09CF,#EC0886);-webkit-background-clip:text;-webkit-text-fill-color:transparent}" +
    ".lbl{font-size:10px;color:#7B4FA0;margin-top:2px}" +
    ".footer{position:absolute;bottom:24px;left:48px;right:48px;display:flex;justify-content:space-between;font-size:10px;color:#B09EC0;border-top:1px solid #eedeff;padding-top:12px}" +
    "@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>" +

    "<div class='page cover'><div>" +
    "<div style='font-size:10px;letter-spacing:4px;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:20px'>ZENVIA — ESPECIALISTAS EM CX E IA AGÊNTICA</div>" +
    "<div style='font-size:38px;font-weight:900;background:linear-gradient(135deg,#8E09CF,#EC0886);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px'>ZENVIA</div>" +
    "<div style='font-size:12px;color:rgba(255,255,255,.55);margin-bottom:36px'>A solução de IA Agêntica para vender mais e atender melhor</div>" +
    "<h1 style='font-size:34px;font-weight:800;color:#fff;margin-bottom:10px;line-height:1.15'>Diagnóstico de Maturidade<br/>de IA Agêntica</h1>" +
    "<div style='font-size:13px;color:rgba(255,255,255,.7);margin-bottom:6px'>Objetivo: <strong style='color:" + uc.color + "'>" + uc.title + "</strong></div>" +
    "<div style='font-size:17px;color:rgba(255,255,255,.85)'>" + (ctx.name || "Empresa") + "</div>" +
    "<div style='font-size:12px;color:rgba(255,255,255,.4);margin-top:4px'>" + [ctx.industry, ctx.size].filter(Boolean).join(" • ") + "</div>" +
    "</div><div>" +
    "<div style='display:flex;gap:14px;margin-bottom:20px'>" +
    "<div style='background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:14px 20px;text-align:center'><div style='font-size:32px;font-weight:800;color:" + mat.cs + ";font-family:Exo 2,sans-serif'>" + overall + "</div><div style='font-size:10px;color:rgba(255,255,255,.5)'>Score Geral</div></div>" +
    "<div style='background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:14px 20px;text-align:center'><div style='font-size:32px;font-weight:800;color:#4040EE;font-family:Exo 2,sans-serif'>" + aiR + "</div><div style='font-size:10px;color:rgba(255,255,255,.5)'>AI Readiness</div></div>" +
    "<div style='background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:14px 20px;text-align:center'><div style='font-size:32px;font-weight:800;color:#EC0886;font-family:Exo 2,sans-serif'>" + agR + "</div><div style='font-size:10px;color:rgba(255,255,255,.5)'>Agentic Ready</div></div>" +
    "</div><div style='background:" + mat.cs + "22;border:1px solid " + mat.cs + "50;border-radius:8px;padding:9px 16px;display:inline-block;margin-bottom:12px'>" +
    "<span style='font-size:13px;font-weight:700;color:" + mat.cs + ";font-family:Exo 2,sans-serif'>Nível " + mat.level + " — " + mat.label + "</span></div>" +
    "<div style='font-size:10px;color:rgba(255,255,255,.28)'>" + dateStr + " • Diagnóstico Confidencial Zenvia</div></div></div>" +

    "<div class='page'><div style='border-bottom:3px solid #8E09CF;margin-bottom:20px;padding-bottom:10px'><div style='font-size:10px;color:#8E09CF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px'>01 — RESUMO EXECUTIVO</div><h2>Diagnóstico de IA Agêntica — " + uc.title + "</h2></div>" +
    narHTML +
    "<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px'>" +
    "<div class='metric'><div class='val'>" + ops.deflPot + "%</div><div class='lbl'>Potencial de Automação</div></div>" +
    "<div class='metric'><div class='val'>-" + ops.tmaRed + "%</div><div class='lbl'>Redução Esforço Manual</div></div>" +
    "<div class='metric'><div class='val'>+" + ops.fcrGain + "%</div><div class='lbl'>Ganho de Eficiência</div></div>" +
    "<div class='metric'><div class='val'>R$" + Math.round(ops.moneySaved / 1000) + "K</div><div class='lbl'>Savings/Mês Estimado</div></div></div>" +
    "<div class='footer'><span>ZENVIA — Especialistas em CX e IA Agêntica</span><span>" + (ctx.name || "") + " • Confidencial</span><span>Pág. 2</span></div></div>" +

    "<div class='page'><div style='border-bottom:3px solid #8E09CF;margin-bottom:20px;padding-bottom:10px'><div style='font-size:10px;color:#8E09CF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px'>02 — SCORECARD</div><h2>Scorecard de Maturidade por Dimensão</h2></div>" +
    "<table><thead><tr><th>Dimensão</th><th>Score Visual</th><th style='text-align:center'>Score</th></tr></thead><tbody>" + dimRows + "</tbody></table>" +
    "<div class='footer'><span>ZENVIA — Especialistas em CX e IA Agêntica</span><span>" + (ctx.name || "") + " • Confidencial</span><span>Pág. 3</span></div></div>" +

    "<div class='page'><div style='border-bottom:3px solid #8E09CF;margin-bottom:20px;padding-bottom:10px'><div style='font-size:10px;color:#8E09CF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px'>03 — PORTFÓLIO RECOMENDADO</div><h2>Soluções Zenvia para " + uc.title + "</h2></div>" +
    "<div style='background:#FFF9DC;border:1px solid #FFD300;border-left:4px solid #FFD300;border-radius:8px;padding:10px 16px;margin-bottom:14px'>" +
    "<span style='font-size:10px;font-weight:700;font-family:Exo 2,sans-serif;color:#A07000;letter-spacing:1px'>⚠ PROJEÇÃO — BASEADA NO PERFIL ATUAL (" + (ctx.size || "Empresa") + ")</span><br/>" +
    "<span style='font-size:11px;color:#4D3000'>As recomendações são projeções com base no diagnóstico. Poderão ser refinadas conforme o projeto avança. " +
    (isEnterprise
      ? "Perfil Enterprise: ZCC Servir + Movidesk | NLU com interop ZCC + Movidesk para casos complexos."
      : "Perfil SMB/Mid-market: ZCC Servir sem Movidesk | NLU com interop ZCC.") +
    " A Zenvia recomendará a melhor solução para cada contexto.</span></div>" +
    "<table style='margin-bottom:16px'><thead><tr><th>Produto Zenvia</th><th>Para que serve</th><th>Tipo</th></tr></thead><tbody>" + prodRows + "</tbody></table>" +
    "<div class='card' style='border-left:4px solid #EC0886'><h3 style='color:#EC0886'>⚠️ Pré-requisitos a Resolver</h3>" + blkHTML + "</div>" +
    "<div class='footer'><span>ZENVIA — Especialistas em CX e IA Agêntica</span><span>" + (ctx.name || "") + " • Confidencial</span><span>Pág. 4</span></div></div>" +

    "<div class='page'><div style='border-bottom:3px solid #8E09CF;margin-bottom:20px;padding-bottom:10px'><div style='font-size:10px;color:#8E09CF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px'>04 — PLANO DE EVOLUÇÃO</div><h2>Roadmap de " + uc.title + " com IA Agêntica</h2></div>" +
    roadHTML +
    "<div class='footer'><span>ZENVIA — Especialistas em CX e IA Agêntica</span><span>" + (ctx.name || "") + " • Confidencial</span><span>Pág. 5</span></div></div>" +

    "<div class='page'><div style='border-bottom:3px solid #8E09CF;margin-bottom:20px;padding-bottom:10px'><div style='font-size:10px;color:#8E09CF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px'>05 — PRÓXIMOS PASSOS</div><h2>Construindo Juntos a Solução Ideal</h2></div>" +
    "<div class='card'><p style='font-size:14px;color:#4D2080;line-height:1.8'>Com base neste diagnóstico, a Zenvia está pronta para iniciar o plano de evolução personalizado para <strong>" + uc.title + "</strong>. Nossa equipe de especialistas em CX e IA Agêntica acompanha cada etapa — do diagnóstico à operação autônoma.</p></div>" +
    "<div style='background:linear-gradient(135deg,#8E09CF,#EC0886);border-radius:12px;padding:22px;color:#fff;text-align:center;margin-top:16px'>" +
    "<div style='font-size:18px;font-weight:800;margin-bottom:6px;font-family:Exo 2,sans-serif'>Pronto para começar?</div>" +
    "<div style='font-size:13px;color:rgba(255,255,255,.85);margin-bottom:10px'>Agende uma sessão estratégica com nosso time de especialistas.</div>" +
    "<a href='https://wa.me/551148377415' style='display:inline-block;background:rgba(255,255,255,.2);border:2px solid rgba(255,255,255,.6);color:#fff;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:800;font-family:Exo 2,sans-serif;text-decoration:none;margin-top:4px'>💬 Agendar via WhatsApp +55 11 4837-7415</a></div>" +
    "<div class='footer'><span>ZENVIA — Especialistas em CX e IA Agêntica</span><span>" + (ctx.name || "") + " • Confidencial</span><span>Pág. 6</span></div></div>" +
    "<script>window.onload=function(){setTimeout(function(){window.print();},1500);};<\/script></body></html>";

  try {
    const blob = new Blob([html], { type:"text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  } catch(e) {
    try {
      const blob = new Blob([html], { type:"text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "zenvia-ai-readiness.html";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch(e2) { alert("Erro ao gerar relatório. Use Chrome ou Firefox."); }
  }
}

// ── GLOBAL STYLES ─────────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, []);
  return null;
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────
function Logo({ size }) {
  const sz = size || 30;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:sz, height:sz, borderRadius:8, background:G.brand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz * 0.55, fontWeight:900, color:"#fff", fontFamily:F.exo }}>Z</div>
      <span style={{ fontSize:sz * 0.72, fontWeight:800, color:C.t1, fontFamily:F.exo, letterSpacing:.5 }}>ZENVIA</span>
    </div>
  );
}

function Navbar({ onBack }) {
  return (
    <nav style={{ background:C.bg, borderBottom:"2px solid " + C.purple + "18", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 2px 16px rgba(142,9,207,.07)" }}>
      <Logo size={28} />
      <div style={{ display:"flex", gap:10 }}>
        {onBack && (
          <button onClick={onBack} style={{ background:"transparent", border:"1.5px solid " + C.purple + "35", color:C.t2, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontFamily:F.exo, fontWeight:600, transition:"all .15s" }}>
            ← Voltar
          </button>
        )}
        <button onClick={()=>window.open("https://wa.me/551148377415?text=Olá,%20vim%20pelo%20Diagnóstico%20de%20IA%20da%20Zenvia%20e%20gostaria%20de%20falar%20com%20um%20especialista.","_blank")} style={{ background:G.brand, color:"#FFFFFF", border:"none", borderRadius:8, padding:"9px 22px", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:F.exo, boxShadow:"0 4px 16px rgba(142,9,207,.3)" }}>
          💬 Falar com Especialista
        </button>
      </div>
    </nav>
  );
}

function Gauge({ value, color, size }) {
  const sz = size || 90;
  const r = (sz - 10) / 2;
  const cx = sz / 2;
  const cy = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const rotateStr = "rotate(-90 " + cx + " " + cy + ")";
  return (
    <svg width={sz} height={sz}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={rotateStr}
        style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      <text x={cx} y={cy - 1} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={Math.round(sz * 0.22)} fontWeight="800" fontFamily={F.exo} letterSpacing="-0.5">{value}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" dominantBaseline="middle" fill="#A87DC8" fontSize={8} fontFamily={F.nunito}>/100</text>
    </svg>
  );
}

function Card({ children, style }) {
  return (
    <div style={Object.assign({ background:C.card, border:"1px solid " + C.brd, borderRadius:14, padding:20 }, style || {})}>
      {children}
    </div>
  );
}

function Pill({ label, color, bg }) {
  return (
    <span style={{ display:"inline-block", background:bg || (color || C.purple) + "14", border:"1.5px solid " + (color || C.purple) + "35", color:color || C.purple, borderRadius:6, padding:"2px 10px", fontSize:10, fontWeight:700, fontFamily:F.exo, letterSpacing:.8, textTransform:"uppercase" }}>
      {label}
    </span>
  );
}

function GradientText({ children }) {
  return (
    <span style={{ background:G.brand, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
      {children}
    </span>
  );
}

// ── LANDING ───────────────────────────────────────────────────────
function Landing({ onStart }) {
  const bubbles = [
    { sym:"WA",  c:C.purple,      top:"10%", left:"6%",  anim:"zFloat 3s ease-in-out infinite"   },
    { sym:"IG",  c:C.pink,        top:"16%", left:"83%", anim:"zFloatB 3.5s ease-in-out infinite" },
    { sym:"⚙️",  c:C.blue,        top:"68%", left:"8%",  anim:"zFloat 4s ease-in-out infinite"    },
    { sym:"📈",  c:C.yellow,      top:"72%", left:"85%", anim:"zFloatB 2.8s ease-in-out infinite" },
    { sym:"🤖",  c:C.purpleLight, top:"44%", left:"4%",  anim:"zFloat 3.2s ease-in-out infinite"  },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      <Navbar />
      <div style={{ flex:1, background:G.hero, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", padding:"72px 28px 60px" }}>
        <div style={{ position:"absolute", top:"-20%", left:"8%", width:"700px", height:"700px", borderRadius:"50%", background:"radial-gradient(circle," + C.purple + "18 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-15%", right:"6%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle," + C.pink + "10 0%,transparent 70%)", pointerEvents:"none" }} />
        {bubbles.map((b, i) => (
          <div key={i} style={{ position:"absolute", top:b.top, left:b.left, width:54, height:54, borderRadius:14, background:b.c + "1A", border:"1.5px solid " + b.c + "55", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:b.c, fontWeight:800, animation:b.anim, fontFamily:F.exo }}>
            {b.sym}
          </div>
        ))}
        <div style={{ textAlign:"center", maxWidth:820, position:"relative", zIndex:1, animation:"zFadeUp .8s ease-out" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(142,9,207,.14)", border:"1px solid rgba(142,9,207,.38)", borderRadius:24, padding:"7px 20px", marginBottom:28 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.pink, animation:"zPulse 2s infinite" }} />
            <span style={{ fontSize:11, color:"#D49AF0", fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", fontFamily:F.exo }}>Zenvia Customer Cloud — Especialistas em CX e IA Agêntica</span>
          </div>
          <h1 style={{ fontSize:"clamp(24px,4.5vw,46px)", fontWeight:900, lineHeight:1.1, margin:"0 0 10px", color:"#FFFFFF", fontFamily:F.exo }}>
            A Zenvia é a solução de IA Agêntica completa
          </h1>
          <h1 style={{ fontSize:"clamp(24px,4.5vw,46px)", fontWeight:900, lineHeight:1.1, margin:"0 0 22px", fontFamily:F.exo }}>
            <GradientText>para ajudar sua empresa a vender mais e atender melhor</GradientText>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.88)", maxWidth:600, margin:"0 auto 12px", lineHeight:1.75, fontFamily:F.nunito }}>
            Não estamos apenas na era da automação — estamos na <strong style={{ color:"#FFFFFF" }}>era da IA Agêntica</strong>. Agentes inteligentes que vendem, atendem e resolvem de ponta a ponta. Com o Zenvia Customer Cloud (ZCC), construímos junto com você o plano ideal.
          </p>
          <p style={{ fontSize:14, color:"rgba(255,255,255,.62)", maxWidth:520, margin:"0 auto 44px", fontFamily:F.nunito }}>
            Do ZCC Atrair ao ZCC Servir — do chatbot ao AI Agent — do diagnóstico à operação autônoma.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
            <button onClick={()=>{ onStart(); trackEvent("cta_click"); }} style={{ background:G.brand, color:"#fff", border:"none", borderRadius:12, padding:"17px 44px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 10px 40px rgba(142,9,207,.4)", fontFamily:F.exo, letterSpacing:.5 }}>
              Descobrir Como Está Minha Empresa
            </button>
            <button onClick={()=>window.open("https://wa.me/551148377415?text=Olá,%20vim%20pelo%20Diagnóstico%20de%20IA%20da%20Zenvia%20e%20gostaria%20de%20falar%20com%20um%20especialista.","_blank")} style={{ background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.9)", border:"1px solid rgba(255,255,255,.22)", borderRadius:12, padding:"17px 28px", fontSize:16, cursor:"pointer", fontFamily:F.nunito, fontWeight:"600" }}>
              💬 Falar com Especialista
            </button>
          </div>
          <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap" }}>
            {[["4","casos de uso"],["~12","questões"],["5","níveis"],["Grátis","e personalizado"]].map(([n, l], i, arr) => (
              <div key={l} style={{ padding:"0 24px", textAlign:"center", borderRight:i < arr.length - 1 ? "1px solid " + C.brd : "none" }}>
                <div style={{ fontSize:24, fontWeight:900, fontFamily:F.exo }}>
                  <GradientText>{n}</GradientText>
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.55)", marginTop:2, fontFamily:F.nunito }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Use case preview strip */}
      <div style={{ background:"#EDE5FF", borderTop:"1px solid rgba(142,9,207,.15)", padding:"24px 32px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <p style={{ fontSize:13, color:C.t3, fontFamily:F.nunito }}>Escolha a dor que você quer resolver e o diagnóstico se adapta ao seu contexto</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
            {USE_CASES.map(uc => (
              <div key={uc.id} style={{ background:uc.bg, border:"1px solid " + uc.color + "30", borderRadius:12, padding:"16px 14px", cursor:"pointer" }} onClick={onStart}>
                <div style={{ fontSize:24, marginBottom:8 }}>{uc.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.t1, fontFamily:F.exo, marginBottom:4 }}>{uc.title}</div>
                <div style={{ fontSize:11, color:C.t3, fontFamily:F.nunito, lineHeight:1.5 }}>{uc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── USE CASE SELECTOR ─────────────────────────────────────────────
function UseCaseSelector({ onSelect, onBack }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"#FFFFFF" }}>
      <Navbar onBack={onBack} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 28px", minHeight:"calc(100vh - 60px)" }}>
        <div style={{ maxWidth:800, width:"100%", animation:"zFadeUp .6s ease-out" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ display:"inline-block", background:"rgba(142,9,207,.14)", border:"1px solid rgba(142,9,207,.32)", borderRadius:6, padding:"3px 12px", fontSize:10, color:C.purpleLight, letterSpacing:3, textTransform:"uppercase", marginBottom:16, fontFamily:F.exo }}>
              PASSO 1 DE 3 — SEU OBJETIVO
            </div>
            <h2 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:800, color:C.t1, fontFamily:F.exo, marginBottom:10 }}>
              Qual é a principal dor que você<br />busca resolver?
            </h2>
            <p style={{ fontSize:15, color:C.t3, fontFamily:F.nunito, lineHeight:1.6 }}>
              Com base na sua escolha, vamos personalizar as perguntas e gerar um diagnóstico específico para o seu contexto.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:32 }}>
            {USE_CASES.map(uc => {
              const isSelected = selected === uc.id;
              const cardStyle = {
                background: isSelected ? uc.bg : C.card,
                border: "2px solid " + (isSelected ? uc.color : C.brd),
                borderRadius: 16,
                padding: "24px 22px",
                cursor: "pointer",
                transition: "all .2s",
                outline: "none",
              };
              return (
                <button key={uc.id} onClick={() => setSelected(uc.id)} style={cardStyle}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                    <div style={{ fontSize:32, flexShrink:0 }}>{uc.icon}</div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontSize:15, fontWeight:800, color:C.t1, fontFamily:F.exo, marginBottom:6 }}>
                        {uc.title}
                      </div>
                      <div style={{ fontSize:13, color:C.t2, fontFamily:F.nunito, lineHeight:1.55, marginBottom:10 }}>
                        {uc.desc}
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                        {uc.tags.map(tag => (
                          <span key={tag} style={{ background:uc.color + "18", color:uc.color, border:"1px solid " + uc.color + "35", borderRadius:12, padding:"2px 9px", fontSize:10, fontFamily:F.exo, fontWeight:600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ marginLeft:"auto", flexShrink:0, width:22, height:22, borderRadius:"50%", background:G.brand, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>✓</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {selected && (
            <div style={{ textAlign:"center", animation:"zFadeIn .4s ease-out" }}>
              <div style={{ background:C.card, border:"1px solid " + (USE_CASES.find(u => u.id === selected)?.color || C.purple) + "35", borderRadius:12, padding:"14px 20px", marginBottom:20, display:"inline-flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>{USE_CASES.find(u => u.id === selected)?.icon}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:12, color:C.t3, fontFamily:F.nunito }}>Objetivo selecionado:</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.t1, fontFamily:F.exo }}>{USE_CASES.find(u => u.id === selected)?.title}</div>
                </div>
              </div>
              <br />
              <button onClick={() => onSelect(selected)} style={{ background:G.brand, color:"#fff", border:"none", borderRadius:10, padding:"15px 48px", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:F.exo, boxShadow:"0 6px 24px rgba(142,9,207,.38)", letterSpacing:.5 }}>
                Continuar →
              </button>
            </div>
          )}
          {!selected && (
            <div style={{ textAlign:"center", color:C.t3, fontSize:13, fontFamily:F.nunito }}>
              Selecione um objetivo acima para continuar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────
function Onboarding({ ucId, onNext, onBack }) {
  const [f, setF] = useState({ name:"", industry:"", size:"", extra:"" });
  const set = (k, v) => setF(prev => Object.assign({}, prev, { [k]: v }));
  const uc = USE_CASES.find(u => u.id === ucId) || USE_CASES[0];
  const valid = f.name.trim() && f.industry && f.size;
  const INDS = ["Financeiro/Fintech","Varejo/eCommerce","Telecomunicações","Saúde/Healthtech","Seguros","Utilities/Energia","Tecnologia/SaaS","Educação","Logística","Indústria","Outro"];
  const SIZES = ["Micro (< 50 func.)","PME (50–500)","Mid-market (500–2K)","Enterprise (2K–10K)","Large Enterprise (> 10K)"];
  const extraLabels = {
    cx:        { label:"Número de agentes de atendimento", placeholder:"Ex: 150" },
    processos: { label:"Volume mensal de tarefas manuais estimado", placeholder:"Ex: 10.000 tarefas" },
    bots:      { label:"Taxa de contenção atual do bot (%)", placeholder:"Ex: 35%" },
    vendas:    { label:"Volume mensal de leads / oportunidades", placeholder:"Ex: 2.000 leads" },
  };
  const extraCfg = extraLabels[ucId] || extraLabels.cx;
  const inp = { width:"100%", background:"#FFFFFF", border:"1.5px solid rgba(142,9,207,.25)", borderRadius:8, padding:"12px 14px", color:C.t1, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:F.nunito };
  const lbl = { fontSize:12, color:C.t3, marginBottom:5, display:"block", fontWeight:700, letterSpacing:.8, textTransform:"uppercase", fontFamily:F.exo };
  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <Navbar />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"44px 24px", minHeight:"calc(100vh - 60px)" }}>
        <div style={{ maxWidth:540, width:"100%", animation:"zFadeUp .6s ease-out" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:uc.bg, border:"1.5px solid " + uc.color + "45", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{uc.icon}</div>
            <div>
              <div style={{ fontSize:10, color:uc.color, letterSpacing:3, textTransform:"uppercase", fontFamily:F.exo }}>PASSO 2 DE 3 — CONTEXTO</div>
              <div style={{ fontSize:13, color:C.t2, fontFamily:F.nunito }}>{uc.title}</div>
            </div>
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, color:C.t1, marginBottom:6, fontFamily:F.exo }}>Contexto da sua empresa</h2>
          <p style={{ color:C.t3, marginBottom:26, fontSize:14, fontFamily:F.nunito }}>Personaliza o diagnóstico e o benchmark para o seu setor</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={lbl}>Nome da empresa *</label>
              <input style={inp} placeholder="Ex: Empresa Exemplo S.A." value={f.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>{extraCfg.label}</label>
              <input style={inp} placeholder={extraCfg.placeholder} value={f.extra} onChange={e => set("extra", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Setor de atuação *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                {INDS.map(i => (
                  <button key={i} onClick={() => set("industry", i)} style={{ background:f.industry === i ? C.purpleSoft : "#F5F0FF", border:"1px solid " + (f.industry === i ? C.purple : "rgba(255,255,255,.1)"), color:f.industry === i ? C.purpleLight : C.t2, borderRadius:8, padding:"9px 12px", cursor:"pointer", fontSize:13, textAlign:"left", fontFamily:F.nunito }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={lbl}>Porte da empresa *</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => set("size", s)} style={{ background:f.size === s ? C.purpleSoft : "#F5F0FF", border:"1px solid " + (f.size === s ? C.purple : "rgba(255,255,255,.1)"), color:f.size === s ? C.purpleLight : C.t2, borderRadius:8, padding:"9px 12px", cursor:"pointer", fontSize:13, fontFamily:F.nunito }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => valid && onNext(f)} style={{ marginTop:26, width:"100%", background:valid ? G.brand : "rgba(142,9,207,.1)", color:valid ? "#fff" : C.t4, border:"none", borderRadius:10, padding:"15px", fontSize:16, fontWeight:700, cursor:valid ? "pointer" : "not-allowed", fontFamily:F.exo, boxShadow:valid ? "0 8px 28px rgba(142,9,207,.38)" : "none" }}>
            Iniciar Diagnóstico →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ASSESSMENT ────────────────────────────────────────────────────
function Assessment({ ucId, onComplete, onBack }) {
  const dims = UC_DIMS[ucId] || [];
  const [di, setDi] = useState(0);
  const [qi, setQi] = useState(0);
  const [responses, setResponses] = useState({});
  const [sel, setSel] = useState(null);
  const uc = USE_CASES.find(u => u.id === ucId) || USE_CASES[0];
  const dim = dims[di];
  const qs = dim ? dim.qs : [];
  const q = qs[qi];
  const totalQ = dims.reduce((s, d) => s + d.qs.length, 0);
  const done = Object.keys(responses).length;
  const pct = Math.round(done / totalQ * 100);

  useEffect(() => {
    const val = q && responses[q.id] !== undefined ? responses[q.id] : null;
    setSel(val);
  }, [di, qi]);

  function goNext() {
    if (sel === null || !q) return;
    const nr = Object.assign({}, responses, { [q.id]: sel });
    setResponses(nr);
    if (qi < qs.length - 1) {
      setQi(qi + 1);
    } else if (di < dims.length - 1) {
      setDi(di + 1);
      setQi(0);
    } else {
      onComplete(nr);
    }
    setSel(null);
  }

  function goPrev() {
    if (qi > 0) {
      setQi(qi - 1);
    } else if (di > 0) {
      const pd = dims[di - 1];
      setDi(di - 1);
      setQi(pd.qs.length - 1);
    }
  }

  if (!dim) return null;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      <Navbar />
      <div style={{ background:"#FAF5FF", borderBottom:"1px solid rgba(142,9,207,.12)", padding:"13px 28px" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>{uc.icon}</span>
              <span style={{ fontSize:11, color:uc.color, fontWeight:700, letterSpacing:2, textTransform:"uppercase", fontFamily:F.exo }}>
                {uc.title}
              </span>
            </div>
            <span style={{ fontSize:12, color:C.t3, fontFamily:F.nunito }}>PASSO 3 · {done}/{totalQ} · {pct}%</span>
          </div>
          <div style={{ height:4, background:"rgba(255,255,255,.07)", borderRadius:2 }}>
            <div style={{ height:"100%", width:pct + "%", background:G.brand, borderRadius:2, transition:"width .4s ease" }} />
          </div>
          <div style={{ display:"flex", gap:6, marginTop:10, overflowX:"auto", paddingBottom:2 }}>
            {dims.map((d, i) => (
              <div key={d.id} style={{ padding:"3px 10px", borderRadius:10, fontSize:10, whiteSpace:"nowrap", flexShrink:0, background:i < di ? d.color + "18" : i === di ? d.color + "10" : "rgba(142,9,207,.04)", border:"1.5px solid " + (i <= di ? d.color : "rgba(142,9,207,.1)"), color:i <= di ? d.color : "#9B80C0", fontWeight:i === di ? 700 : 400, fontFamily:F.exo }}>
                {i < di ? "✓ " : ""}{d.short}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ maxWidth:660, width:"100%", animation:"zFadeUp .4s ease-out" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:4, height:40, borderRadius:2, background:dim.color }} />
            <div>
              <div style={{ fontSize:11, color:dim.color, textTransform:"uppercase", letterSpacing:3, fontWeight:700, fontFamily:F.exo }}>{dim.label}</div>
              <div style={{ fontSize:12, color:C.t3, fontFamily:F.nunito }}>Pergunta {qi + 1} de {qs.length}</div>
            </div>
          </div>
          <h2 style={{ fontSize:"clamp(17px,3vw,22px)", fontWeight:700, lineHeight:1.45, margin:"0 0 8px", color:C.t1, fontFamily:F.exo }}>
            {q ? q.text : ""}
          </h2>
          {q && q.hint && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"rgba(142,9,207,.06)", border:"1.5px solid rgba(142,9,207,.15)", borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
              <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
              <p style={{ fontSize:12, color:C.t2, fontFamily:F.nunito, lineHeight:1.6 }}>{q.hint}</p>
            </div>
          )}
          {q && !q.hint && <div style={{ marginBottom:16 }} />}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q && q.opts.map(opt => (
              <button key={opt.v} onClick={() => setSel(opt.v)} style={{ background:sel === opt.v ? "rgba(142,9,207,.16)" : "rgba(255,255,255,.03)", border:"1px solid " + (sel === opt.v ? C.purple : "rgba(255,255,255,.08)"), borderRadius:10, padding:"13px 18px", cursor:"pointer", textAlign:"left", color:sel === opt.v ? C.t1 : C.t2, fontSize:14, display:"flex", alignItems:"center", gap:14, transition:"all .15s", fontFamily:F.nunito }}>
                <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid " + (sel === opt.v ? C.purple : "rgba(142,9,207,.25)"), background:sel === opt.v ? G.brand : "#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {sel === opt.v && <div style={{ width:7, height:7, borderRadius:"50%", background:"white" }} />}
                </div>
                {opt.l}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            {(di > 0 || qi > 0) && (
              <button onClick={goPrev} style={{ background:C.bg, border:"1.5px solid rgba(142,9,207,.2)", color:C.t2, borderRadius:8, padding:"12px 18px", cursor:"pointer", fontSize:14, fontFamily:F.exo, fontWeight:600 }}>
                ← Anterior
              </button>
            )}
            <button onClick={goNext} disabled={sel === null} style={{ flex:1, background:sel !== null ? G.brand : "rgba(142,9,207,.08)", color:sel !== null ? "#fff" : C.t4, border:"none", borderRadius:10, padding:"13px", fontSize:15, fontWeight:700, cursor:sel !== null ? "pointer" : "not-allowed", fontFamily:F.exo, boxShadow:sel !== null ? "0 8px 28px rgba(142,9,207,.35)" : "none" }}>
              {qi < qs.length - 1 || di < dims.length - 1 ? "Próxima Pergunta →" : "Gerar Diagnóstico →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROCESSING ────────────────────────────────────────────────────
function Processing({ ucId, onDone }) {
  const uc = USE_CASES.find(u => u.id === ucId) || USE_CASES[0];
  const steps = [
    "Analisando suas respostas...",
    "Calculando sua pontuação para '" + uc.title + "'...",
    "Identificando pontos de atenção...",
    "Verificando prontidão para IA...",
    "Verificando prontidão para Agentes...",
    "Escolhendo as melhores soluções para você...",
    "Especialista Zenvia analisando seu perfil...",
    "Preparando seu plano de evolução...",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length - 1) { clearInterval(t); setTimeout(onDone, 900); }
    }, 480);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <Navbar />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 60px)", padding:32 }}>
        <div style={{ marginBottom:36, position:"relative", width:90, height:90 }}>
          <svg width={90} height={90} style={{ animation:"zSpin 2s linear infinite", position:"absolute" }}>
            <defs>
              <linearGradient id="spg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.purple} />
                <stop offset="100%" stopColor={C.pink} />
              </linearGradient>
            </defs>
            <circle cx={45} cy={45} r={40} fill="none" stroke="rgba(142,9,207,.15)" strokeWidth={4} />
            <circle cx={45} cy={45} r={40} fill="none" stroke="url(#spg)" strokeWidth={4} strokeDasharray="62 188" strokeLinecap="round" />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{uc.icon}</div>
        </div>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.t1, marginBottom:4, fontFamily:F.exo }}>Analisando sua empresa...</h2>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:uc.bg, border:"1.5px solid " + uc.color + "40", borderRadius:20, padding:"5px 14px", margin:"8px 0 28px" }}>
          <span style={{ color:uc.color, fontSize:13, fontWeight:600, fontFamily:F.exo }}>{uc.title}</span>
        </div>
        <div style={{ width:"100%", maxWidth:420 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:"1px solid rgba(142,9,207,.15)", opacity:i <= step ? 1 : .2, transition:"opacity .35s" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:i < step ? "rgba(236,8,134,.2)" : i === step ? "rgba(142,9,207,.22)" : "rgba(255,255,255,.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0, color:i < step ? C.pink : i === step ? C.purple : "transparent", fontWeight:800 }}>
                {i < step ? "✓" : i === step ? "●" : ""}
              </div>
              <span style={{ fontSize:13, color:i < step ? C.pink : i === step ? C.t2 : C.t4, fontFamily:F.nunito }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BENCHMARK TAB ─────────────────────────────────────────────────
function BenchmarkTab({ scores, ctx }) {
  const bench = BENCH[ctx.industry] || BENCH["Outro"];
  const { overall, dims, dimScores, mat } = scores;
  const pctile = overall >= bench.p90 ? "Top 10%" :
                 overall >= bench.p75 ? "Top 25%" :
                 overall >= bench.p50 ? "Acima da Mediana" :
                 overall >= bench.p25 ? "Abaixo da Mediana" : "Bottom 25%";
  const pctColor = overall >= bench.p75 ? C.yellow :
                   overall >= bench.p50 ? C.blue : C.pink;
  const bars = [
    { label:"P25 (25% mais baixo)",  value:bench.p25, color:"rgba(255,255,255,.2)"  },
    { label:"P50 – Mediana",          value:bench.p50, color:C.blue                 },
    { label:"P75 (25% mais alto)",    value:bench.p75, color:C.purple               },
    { label:"P90 (Top 10%)",          value:bench.p90, color:C.pink                 },
    { label:"Sua empresa",            value:overall,   color:C.yellow               },
  ];
  const dimBarData = dims.map(d => ({
    name: d.short,
    score: Math.round(dimScores[d.id] || 0),
    color: d.color,
  }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Position card */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <div style={{ fontSize:11, color:C.t3, letterSpacing:2, textTransform:"uppercase", marginBottom:10, fontFamily:F.exo }}>
            POSICIONAMENTO — {ctx.industry || "SEU SETOR"}
          </div>
          <div style={{ fontSize:40, fontWeight:900, fontFamily:F.exo, marginBottom:6 }}>
            <span style={{ background:"linear-gradient(135deg," + pctColor + "," + C.purple + ")", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {pctile}
            </span>
          </div>
          <div style={{ fontSize:13, color:C.t2, marginBottom:16, fontFamily:F.nunito }}>
            Score <strong style={{ color:C.yellow }}>{overall}</strong> vs. mediana do setor{" "}
            <strong style={{ color:C.blue }}>{bench.p50}</strong>
          </div>
          {/* Percentile bars */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {bars.map(b => (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:120, fontSize:11, color:b.label === "Sua empresa" ? b.color : C.t3, fontFamily:F.nunito, flexShrink:0 }}>
                  {b.label}
                </div>
                <div style={{ flex:1, height:6, background:"rgba(255,255,255,.07)", borderRadius:3, position:"relative" }}>
                  <div style={{ height:"100%", width:b.value + "%", background:b.color, borderRadius:3, transition:"width 1s ease" }} />
                </div>
                <div style={{ width:28, fontSize:12, fontWeight:b.label === "Sua empresa" ? 800 : 400, color:b.color, fontFamily:F.exo, textAlign:"right" }}>
                  {b.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:13, fontWeight:700, color:C.t1, marginBottom:14, fontFamily:F.exo }}>
            Contexto LATAM — Maturidade em IA
          </div>
          {[
            { label:BENCH_LATAM.brasil.label, value:BENCH_LATAM.brasil.score, color:C.purple    },
            { label:BENCH_LATAM.latam.label,  value:BENCH_LATAM.latam.score,  color:C.blue      },
            { label:BENCH_LATAM.liders.label, value:BENCH_LATAM.liders.score, color:C.pink      },
            { label:"Sua empresa",            value:overall,                  color:C.yellow     },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:row.label === "Sua empresa" ? row.color : C.t2, fontFamily:F.nunito }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:row.color, fontFamily:F.exo }}>{row.value}</span>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,.07)", borderRadius:3 }}>
                <div style={{ height:"100%", width:row.value + "%", background:row.color, borderRadius:3, transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"8px 12px", background:"rgba(21,21,204,.08)", border:"1px solid rgba(21,21,204,.25)", borderRadius:8 }}>
            <div style={{ fontSize:10, color:C.blue, fontWeight:700, fontFamily:F.exo, marginBottom:2 }}>💡 REFERÊNCIA</div>
            <div style={{ fontSize:11, color:C.t3, fontFamily:F.nunito }}>{BENCH_LATAM.nota}</div>
          </div>
        </Card>
      </div>
      {/* Dimension scores absolute */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.t1, marginBottom:4, fontFamily:F.exo }}>
          Score por Dimensão — Distribuição Absoluta
        </div>
        <div style={{ fontSize:12, color:C.t3, marginBottom:14, fontFamily:F.nunito }}>
          Valores de 0–100 para as dimensões avaliadas no seu caso de uso específico
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dimBarData} margin={{ top:5, right:5, left:-25, bottom:30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(142,9,207,.08)" />
            <XAxis dataKey="name" tick={{ fill:"#9B80C0", fontSize:10, fontFamily:F.nunito }} angle={-20} textAnchor="end" />
            <YAxis domain={[0,100]} tick={{ fill:"#9B80C0", fontSize:10, fontFamily:F.nunito }} />
            <Tooltip
              contentStyle={{ background:"#1A0038", border:"1px solid " + C.purple + "30", borderRadius:8, color:"white", fontSize:12, fontFamily:F.nunito }}
              formatter={(value, name) => [value + "/100", "Score"]}
            />
            <Bar dataKey="score" name="Score" fill={C.purple} radius={[4,4,0,0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
          {dimBarData.map(d => (
            <div key={d.name} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:d.color }} />
              <span style={{ fontSize:11, color:C.t2, fontFamily:F.nunito }}>{d.name}: <strong style={{ color:d.color, fontFamily:F.exo }}>{d.score}</strong></span>
            </div>
          ))}
        </div>
      </Card>
      {/* Methodology note */}
      <div style={{ background:"rgba(21,21,204,.06)", border:"1px solid rgba(21,21,204,.2)", borderRadius:12, padding:"14px 18px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
          <span style={{ fontSize:18, flexShrink:0 }}>📋</span>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.blue, fontFamily:F.exo, marginBottom:4 }}>
              METODOLOGIA DE BENCHMARK — DADOS VALIDADOS 2025-2026
            </div>
            <div style={{ fontSize:12, color:C.t3, fontFamily:F.nunito, lineHeight:1.7 }}>
              Benchmark atualizado com fontes primárias 2025-2026:{" "}
              <strong style={{ color:C.t2 }}>McKinsey State of AI Nov 2025</strong> (n=1.993, 105 países — 88% usam IA, 6% high performers),{" "}
              <strong style={{ color:C.t2 }}>Stanford AI Index 2026</strong> (adoção 88%, agentes 77% em tarefas reais),{" "}
              <strong style={{ color:C.t2 }}>Gartner AI Maturity Survey Q4/2024</strong> (40% dos apps enterprise com AI Agents até 2026),{" "}
              <strong style={{ color:C.t2 }}>IDC CIO Playbook 2026</strong> (Brasil: 67% adoção sistêmica; Telecom 76%, Bancos 69%) e{" "}
              <strong style={{ color:C.t2 }}>Forrester State of AI 2025 + Predictions 2026</strong>.{" "}
              Valores normalizados para escala 0–100 e calibrados para Brasil/LATAM via IDC 2026.
              Distribuição por percentil (P25/P50/P75/P90) por segmento de indústria. Última atualização: maio/2026.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT CONTEXT HELPER ──────────────────────────────────────
// Ajusta descrição e nome do produto conforme porte da empresa.
// NLU: SMB/Mid = interop ZCC | Enterprise = interop ZCC + Movidesk
// ZCC Servir: SMB/Mid = sem Movidesk | Enterprise = com Movidesk
function getProductCtx(p, ctx) {
  const size = (ctx && ctx.size) || "";
  const isEnterprise = size.toLowerCase().includes("enterprise");
  const name = p.name || "";

  if (name.includes("ZCC Servir")) {
    if (isEnterprise) {
      return {
        ...p,
        name: "ZCC Servir + Movidesk",
        desc: "Para clientes Enterprise: atendimento humano com triagem do bot e roteamento inteligente. Integrado ao Movidesk (gestão de tickets, SLA enterprise e knowledge base) — ofertado de forma personalizada para quem precisa de gestão avançada de atendimento.",
      };
    }
    return {
      ...p,
      name: "ZCC Servir",
      desc: "Para clientes SMB/Mid-market: bot compila o contexto da triagem e direciona ao grupo correto de atendimento. Solução ágil de atendimento ao cliente sem a complexidade do Movidesk.",
    };
  }

  if (name.includes("NLU")) {
    if (isEnterprise) {
      return {
        ...p,
        name: "NLU — interop ZCC + Movidesk",
        desc: "Para clientes Enterprise ou casos de uso complexos: LLMs avançadas e personalizadas integradas ao ZCC e ao Movidesk via interop nativa. Ideal para jornadas de atendimento sofisticadas, múltiplos idiomas ou alta customização.",
      };
    }
    return {
      ...p,
      name: "NLU — interop ZCC",
      desc: "Para clientes SMB/Mid-market que precisam de personalização além do ZCC Chatbot: fluxos de chatbot complexos e LLMs personalizadas integradas ao ZCC via interop nativa.",
    };
  }

  return p;
}

// ── RESULTS ───────────────────────────────────────────────────────
function Results({ scores, ctx, ucId, narrative, onBack }) {
  const [tab, setTab] = useState("overview");
  const uc = USE_CASES.find(u => u.id === ucId) || USE_CASES[0];
  const { overall, aiR, agR, mat, dims, dimScores } = scores;
  const blockers = getBlockers(scores, ucId);
  const ops = calcOps(scores);
  const products = PRODUCTS[ucId] || PRODUCTS.cx;
  const roadmap = ROADMAPS[ucId] || ROADMAPS.cx;
  const radarData = dims.map(d => ({ dim: d.short, score: Math.round(dimScores[d.id] || 0), fullMark:100 }));

  const TABS = [
    { id:"overview",   l:"Resumo"      },
    { id:"benchmark",  l:"Como me comparo"         },
    { id:"portfolio",  l:"Soluções Zenvia"  },
    { id:"roadmap",    l:"Próximos Passos" },
    { id:"report",     l:"Baixar Relatório"     },
  ];

  function handlePDF() {
    openPDF(scores, ctx, narrative, ucId);
  }

  const infoBadge = [
    { l:"Maturidade", v:overall, c:mat.cs },
    { l:"Prontidão para IA", v:aiR,   c:C.blue },
    { l:"Agentic",      v:agR,   c:C.pink },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      <Navbar onBack={onBack} />
      {/* Score bar */}
      <div style={{ background:"#FFFFFF", borderBottom:"2px solid " + C.purple + "20", boxShadow:"0 2px 16px rgba(142,9,207,.08)", padding:"12px 28px", display:"flex", flexWrap:"wrap", alignItems:"center", gap:14, justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ fontSize:16 }}>{uc.icon}</span>
            <span style={{ fontSize:10, color:uc.color, letterSpacing:3, textTransform:"uppercase", fontWeight:700, fontFamily:F.exo }}>{uc.title}</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:C.t1, fontFamily:F.exo }}>{ctx.name || "Diagnóstico"}</div>
          <div style={{ fontSize:12, color:C.t3, fontFamily:F.nunito }}>{[ctx.industry, ctx.size].filter(Boolean).join(" · ")}</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          {infoBadge.map(s => (
            <div key={s.l} style={{ textAlign:"center", background:C.bgSection, border:"1.5px solid " + C.brd, borderRadius:10, padding:"7px 14px" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.c, lineHeight:1, fontFamily:F.exo }}>{s.v}</div>
              <div style={{ fontSize:10, color:C.t3, marginTop:2, fontFamily:F.nunito, textTransform:"uppercase", letterSpacing:1 }}>{s.l}</div>
            </div>
          ))}
          <div style={{ background:mat.cs + "16", border:"1px solid " + mat.cs + "50", borderRadius:16, padding:"7px 16px", display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:mat.cs }} />
            <span style={{ fontSize:12, color:mat.cs, fontWeight:700, fontFamily:F.exo }}>N{mat.level} — {mat.label}</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        {/* Sidebar */}
        <div style={{ width:180, background:"#F0E8FF", borderRight:"1px solid " + C.purple + "25", padding:"14px 8px", display:"flex", flexDirection:"column", gap:3, flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display:"flex", alignItems:"center", padding:"10px 12px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:tab === t.id ? 700 : 400, background:tab === t.id ? "#FFFFFF" : "transparent", color:tab === t.id ? C.purple : C.t3, borderLeft:tab === t.id ? "3px solid " + C.purple : "3px solid transparent", transition:"all .15s", textAlign:"left", width:"100%", fontFamily:tab === t.id ? F.exo : F.nunito }}>
              {t.l}
            </button>
          ))}
          {/* Use case selector */}
          <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid " + C.brd }}>
            <div style={{ fontSize:9, color:"#9B80C0", marginBottom:8, fontFamily:F.exo, letterSpacing:2, textTransform:"uppercase" }}>Diagnóstico para:</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:uc.bg, border:"1.5px solid " + uc.color + "40", borderRadius:8, padding:"8px 10px" }}>
              <span style={{ fontSize:16 }}>{uc.icon}</span>
              <span style={{ fontSize:11, color:uc.color, fontWeight:700, fontFamily:F.exo }}>{uc.title.split(" ").slice(0, 3).join(" ")}</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:"24px 28px", background:"#F4F0FF" }}>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {[
                  { l:"Sua Pontuação", v:overall, c:mat.cs, sub:"Nível " + mat.level + " — " + mat.label },
                  { l:"Prontidão para IA", v:aiR, c:C.blue, sub:aiR >= 60 ? "Sua empresa está pronta" : "Em evolução" },
                  { l:"Pronto para Agentes", v:agR, c:C.pink, sub:agR >= 60 ? "Pronta para Agentes IA" : "Evoluindo" },
                ].map(sc => (
                  <Card key={sc.l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.t3, letterSpacing:2, textTransform:"uppercase", marginBottom:12, fontFamily:F.exo }}>{sc.l}</div>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Gauge value={sc.v} color={sc.c} /></div>
                    <div style={{ fontSize:12, color:sc.c, fontWeight:600, fontFamily:F.nunito }}>{sc.sub}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[
                  { l:"Potencial de Automação", v:ops.deflPot + "%",    c:C.yellow, d:"Volume automatizável" },
                  { l:"Redução no Tempo",        v:"-" + ops.tmaRed + "%",c:C.blue,   d:"Duração dos atendimentos" },
                  { l:"Ganho de Eficiência",      v:"+" + ops.fcrGain + "%",c:C.purple,d:"Melhora operacional" },
                  { l:"Savings/Mês",              v:"R$" + Math.round((ops.moneySaved || 0) / 1000) + "K", c:C.pink, d:"Estimado com IA Agêntica" },
                ].map(m => (
                  <Card key={m.l} style={{ padding:"16px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:26, fontWeight:900, fontFamily:F.exo, color:m.c, lineHeight:1 }}>{m.v}</div>
                    <div style={{ fontSize:11, color:C.t2, marginTop:5, fontWeight:600, fontFamily:F.nunito }}>{m.l}</div>
                    <div style={{ fontSize:10, color:C.t3, fontFamily:F.nunito }}>{m.d}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:14 }}>
                <Card>
                  <div style={{ fontSize:14, fontWeight:700, color:C.t1, marginBottom:2, fontFamily:F.exo }}>Radar de Maturidade — {uc.title}</div>
                  <div style={{ fontSize:12, color:C.t3, marginBottom:12, fontFamily:F.nunito }}>Dimensões específicas para o seu objetivo</div>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData} margin={{ top:8, right:20, bottom:8, left:20 }}>
                      <PolarGrid stroke="rgba(142,9,207,.12)" />
                      <PolarAngleAxis dataKey="dim" tick={{ fill:"#6D3FA0", fontSize:10, fontFamily:F.nunito, fontWeight:"500" }} />
                      <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fill:"#A87DC8", fontSize:8 }} tickCount={4} />
                      <Radar dataKey="score" stroke={uc.color} fill={uc.color} fillOpacity={.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
                <Card>
                  <div style={{ fontSize:14, fontWeight:700, color:C.t1, marginBottom:14, fontFamily:F.exo }}>Scores por Dimensão</div>
                  {dims.map(d => {
                    const s = Math.round(dimScores[d.id] || 0);
                    return (
                      <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <div style={{ fontSize:10, color:d.color, width:72, flexShrink:0, fontWeight:700, fontFamily:F.exo }}>{d.short}</div>
                        <div style={{ flex:1, height:5, background:"rgba(255,255,255,.07)", borderRadius:3 }}>
                          <div style={{ height:"100%", width:s + "%", background:d.color, borderRadius:3, transition:"width 1.2s ease" }} />
                        </div>
                        <div style={{ fontSize:12, color:d.color, fontWeight:800, width:24, textAlign:"right", fontFamily:F.exo }}>{s}</div>
                      </div>
                    );
                  })}
                </Card>
              </div>
              {blockers.length > 0 && (
                <div style={{ background:"rgba(236,8,134,.06)", border:"1px solid rgba(236,8,134,.25)", borderRadius:12, padding:"16px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:16 }}>⚠️</span>
                    <span style={{ color:"rgba(246,108,182,.95)", fontWeight:800, fontSize:14, fontFamily:F.exo }}>
                      {blockers.length} Pré-requisito{blockers.length > 1 ? "s" : ""} Crítico{blockers.length > 1 ? "s" : ""} — Resolver Antes de Qualquer IA
                    </span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:10 }}>
                    {blockers.map((b, i) => (
                      <div key={i} style={{ background:"rgba(236,8,134,.05)", borderRadius:10, padding:"12px 14px", borderLeft:"3px solid " + C.pink }}>
                        <div style={{ fontWeight:700, fontSize:13, color:"rgba(246,108,182,.95)", marginBottom:3, fontFamily:F.exo }}>🚫 {b.title}</div>
                        <div style={{ fontSize:12, color:C.t2, marginBottom:5, lineHeight:1.5, fontFamily:F.nunito }}>{b.msg}</div>
                        <div style={{ fontSize:12, color:C.yellow, fontFamily:F.nunito }}>✅ {b.fix}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {narrative && (
                <Card style={{ background:"rgba(142,9,207,.07)", border:"1px solid rgba(142,9,207,.3)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:G.brand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.t1, fontFamily:F.exo }}>Diagnóstico Especializado Zenvia</div>
                      <div style={{ fontSize:11, color:"rgba(192,144,255,.7)", fontFamily:F.nunito }}>Análise personalizada para: {uc.title}</div>
                    </div>
                    <span style={{ marginLeft:"auto", background:"rgba(142,9,207,.2)", border:"1px solid " + C.brdHi, borderRadius:10, padding:"2px 10px", fontSize:9, color:C.purpleLight, fontWeight:700, fontFamily:F.exo }}>CLAUDE AI</span>
                  </div>
                  <p style={{ fontSize:13, color:C.t2, lineHeight:1.9, whiteSpace:"pre-line", fontFamily:F.nunito }}>{narrative}</p>
                </Card>
              )}
            </div>
          )}

          {/* BENCHMARK TAB */}
          {tab === "benchmark" && (
            <BenchmarkTab scores={scores} ctx={ctx} />
          )}

          {/* PORTFOLIO TAB */}
          {tab === "portfolio" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card style={{ background:"linear-gradient(135deg,rgba(28,0,60,.95),rgba(40,0,80,.85))" }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#FFFFFF", marginBottom:4, fontFamily:F.exo }}>
                  {uc.icon} Portfólio Zenvia para: {uc.title}
                </div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.72)", fontFamily:F.nunito }}>
                  Soluções selecionadas para o seu caso de uso e nível de maturidade.{" "}
                  {ctx.size && ctx.size.toLowerCase().includes("enterprise")
                    ? "Perfil Enterprise: Movidesk no ZCC Servir + NLU com interop ZCC + Movidesk."
                    : "Perfil SMB/Mid: ZCC Servir + NLU com interop ZCC."}
                </p>
              </Card>

              {/* Disclaimer de projeção */}
              <div style={{ background:"rgba(255,211,0,.08)", border:"1px solid rgba(255,211,0,.3)", borderRadius:10, padding:"12px 18px", display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:C.yellow, fontFamily:F.exo, marginBottom:3, letterSpacing:.8 }}>
                    PROJEÇÃO — BASEADA NO PERFIL ATUAL
                  </div>
                  <p style={{ fontSize:12, color:C.t2, fontFamily:F.nunito, lineHeight:1.65 }}>
                    As recomendações abaixo são projeções com base no diagnóstico e porte informado{ctx.size ? " (" + ctx.size + ")" : ""}.{" "}
                    Poderão ser refinadas conforme o projeto avança. A Zenvia sempre recomendará a solução mais adequada ao contexto e momento do cliente.{" "}
                    <strong style={{ color:C.t1 }}>ZCC Servir + Movidesk</strong> são ofertados de forma personalizada:{" "}
                    Movidesk para atendimento ao cliente em clientes Enterprise;{" "}
                    <strong style={{ color:C.t1 }}>NLU + ZCC</strong> para SMB/Mid e{" "}
                    <strong style={{ color:C.t1 }}>NLU + ZCC + Movidesk</strong> para Enterprise ou casos de uso mais complexos.
                  </p>
                </div>
              </div>

              {products.map((p, i) => {
                const cp = getProductCtx(p, ctx);
                const isAvailable = cp.level <= mat.level;
                const bcColor = cp.badge === "QUICK WIN" ? C.yellow : cp.badge === "HIGH IMPACT" ? C.pink : cp.badge === "COMPLEX" ? C.purple : C.blue;
                const isMovidesk = cp.name && cp.name.includes("Movidesk");
                const isNLU = cp.name && cp.name.includes("NLU");
                return (
                  <div key={i} style={{ background:isAvailable ? "rgba(255,211,0,.03)" : "rgba(255,255,255,.02)", border:"1px solid " + (isAvailable ? "rgba(255,211,0,.2)" : C.brd), borderRadius:14, padding:"20px 22px", opacity:isAvailable ? 1 : .65, transition:"all .2s" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                      <div style={{ flex:1, minWidth:220 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                          <span style={{ fontSize:22 }}>{cp.icon}</span>
                          <div>
                            <div style={{ fontSize:15, fontWeight:800, color:C.t1, fontFamily:F.exo }}>{cp.name}</div>
                            <div style={{ fontSize:12, color:C.t3, marginTop:1, fontFamily:F.nunito }}>Requer Nível {cp.level}+ de maturidade</div>
                          </div>
                          <Pill label={cp.badge} color={bcColor} />
                          {isMovidesk && (
                            <Pill label="ENTERPRISE" color={C.blue} />
                          )}
                          {isNLU && (
                            <Pill label={ctx.size && ctx.size.toLowerCase().includes("enterprise") ? "ENTERPRISE" : "SMB/MID"} color={C.purple} />
                          )}
                        </div>
                        <p style={{ fontSize:13, color:C.t2, lineHeight:1.65, fontFamily:F.nunito }}>{cp.desc}</p>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ background:isAvailable ? "rgba(255,211,0,.14)" : "rgba(255,255,255,.06)", border:"1px solid " + (isAvailable ? C.yellow + "50" : C.brd), color:isAvailable ? C.yellow : C.t3, borderRadius:12, padding:"5px 14px", fontSize:11, fontWeight:700, fontFamily:F.exo }}>
                          {isAvailable ? "✅ DISPONÍVEL AGORA" : "⏳ NÍVEL " + cp.level + "+ REQUERIDO"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ROADMAP TAB */}
          {tab === "roadmap" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card style={{ background:"linear-gradient(135deg,rgba(28,0,60,.95),rgba(40,0,80,.85))" }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#FFFFFF", marginBottom:4, fontFamily:F.exo }}>
                  {uc.icon} Plano de Evolução — {uc.title}
                </div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.72)", fontFamily:F.nunito }}>
                  Construído especificamente para o seu objetivo. Construímos juntos — do diagnóstico à autonomia.
                </p>
              </Card>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {[
                  { l:"Duração Estimada",      v:"24–36 meses",         c:C.purple },
                  { l:"Investimento",           v:"Conforme proposta",   c:C.pink   },
                  { l:"Próximo passo",          v:"💬 Falar com Especialista", c:C.yellow, wa:true },
                ].map(m => (
                  <Card key={m.l} onClick={m.wa ? ()=>window.open("https://wa.me/551148377415?text=Ol%C3%A1%2C%20vim%20pelo%20Diagn%C3%B3stico%20de%20IA%20da%20Zenvia%20e%20gostaria%20de%20falar%20com%20um%20especialista.","_blank") : undefined} style={{ textAlign:"center", padding:"16px 12px", cursor:m.wa?"pointer":"default", border:m.wa?"1.5px solid "+C.yellow+"60":"1.5px solid "+C.brd, boxShadow:m.wa?"0 4px 16px rgba(255,211,0,.18)":"0 2px 12px rgba(142,9,207,.06)" }}>
                    <div style={{ fontSize:m.l === "Investimento" ? 14 : m.wa ? 13 : 20, fontWeight:900, color:m.c, marginBottom:4, fontFamily:F.exo, lineHeight:1.2 }}>{m.v}</div>
                    <div style={{ fontSize:11, color:C.t3, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, fontFamily:F.exo }}>{m.l}</div>
                  </Card>
                ))}
              </div>
              {roadmap.map((ph, i) => (
                <div key={i} style={{ display:"flex", gap:14 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:ph.c + "16", border:"2px solid " + ph.c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:ph.c, flexShrink:0, fontFamily:F.exo }}>
                      {ph.p}
                    </div>
                    {i < roadmap.length - 1 && <div style={{ width:2, flex:1, background:ph.c + "22", marginTop:6, minHeight:40 }} />}
                  </div>
                  <Card style={{ flex:1, borderLeft:"3px solid " + ph.c }}>
                    <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:8, marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:16, fontWeight:800, color:C.t1, fontFamily:F.exo }}>Fase {ph.p}: {ph.name}</div>
                        <div style={{ display:"flex", gap:10, marginTop:3 }}>
                          <span style={{ fontSize:11, color:C.t3, fontFamily:F.nunito }}>⏱ {ph.time}</span>
                          <span style={{ fontSize:11, color:ph.c, fontWeight:700, fontFamily:F.exo }}></span>
                        </div>
                      </div>
                      <div style={{ background:ph.c + "14", border:"1px solid " + ph.c + "40", borderRadius:8, padding:"5px 12px", fontSize:11, color:ph.c, fontWeight:700, textAlign:"center", fontFamily:F.exo }}>
                        🏁 {ph.kpi}
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:6 }}>
                      {ph.items.map((it, j) => (
                        <div key={j} style={{ display:"flex", gap:8, fontSize:12, color:C.t2, lineHeight:1.4, fontFamily:F.nunito }}>
                          <span style={{ color:ph.c, flexShrink:0 }}>›</span>{it}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* REPORT TAB */}
          {tab === "report" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(142,9,207,.16),rgba(236,8,134,.1))", border:"1px solid " + C.brdHi, borderRadius:16, padding:"28px 32px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>📄</div>
                <h3 style={{ fontSize:20, fontWeight:800, color:C.t1, marginBottom:8, fontFamily:F.exo }}>Relatório Executivo Personalizado</h3>
                <p style={{ color:C.t2, fontSize:14, maxWidth:500, margin:"0 auto 8px", lineHeight:1.7, fontFamily:F.nunito }}>
                  PDF específico para <strong style={{ color:C.t1 }}>{uc.title}</strong> — diagnóstico, portfólio Zenvia, plano de evolução e análise de riscos.
                </p>
                <p style={{ color:C.t3, fontSize:12, maxWidth:480, margin:"0 auto 24px", fontFamily:F.nunito }}>
                  Ideal para apresentar internamente e alinhar o plano de evolução com sua liderança.
                </p>
                <button onClick={handlePDF} style={{ background:G.brand, color:"#fff", border:"none", borderRadius:12, padding:"15px 40px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(142,9,207,.4)", fontFamily:F.exo }}>
                  ↓ Baixar Relatório Executivo
                </button>
                <p style={{ color:C.t3, fontSize:12, marginTop:10, fontFamily:F.nunito }}>Abre em nova aba · Ctrl+P para salvar como PDF</p>
              </div>
              {narrative && (
                <Card style={{ background:"rgba(142,9,207,.07)", border:"1px solid rgba(142,9,207,.3)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:G.brand, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.t1, fontFamily:F.exo }}>Diagnóstico Especializado</div>
                      <div style={{ fontSize:11, color:"rgba(192,144,255,.7)", fontFamily:F.nunito }}>Gerado por IA generativa — {uc.title}</div>
                    </div>
                    <span style={{ marginLeft:"auto", background:"rgba(142,9,207,.2)", border:"1px solid " + C.brdHi, borderRadius:10, padding:"2px 10px", fontSize:9, color:C.purpleLight, fontWeight:700, fontFamily:F.exo }}>CLAUDE AI</span>
                  </div>
                  <p style={{ fontSize:13, color:C.t2, lineHeight:1.9, whiteSpace:"pre-line", fontFamily:F.nunito }}>{narrative}</p>
                </Card>
              )}
            </div>
          )}

          {/* FOOTER CTA */}
          <div style={{ marginTop:24, background:"linear-gradient(135deg,rgba(142,9,207,.15),rgba(236,8,134,.1))", border:"1px solid " + C.brdHi, borderRadius:14, padding:"22px 26px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:14 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:C.t1, marginBottom:4, fontFamily:F.exo }}>Pronto para {uc.title.toLowerCase()}?</div>
              <div style={{ fontSize:13, color:C.t2, fontFamily:F.nunito }}>Especialistas Zenvia prontos para construir seu plano personalizado.</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button
                onClick={()=>window.open("https://wa.me/551148377415?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20sess%C3%A3o%20estrat%C3%A9gica%20com%20um%20especialista%20Zenvia.","_blank")}
                style={{ background:G.brand, color:"#fff", border:"none", borderRadius:10, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:F.exo, display:"flex", alignItems:"center", gap:8 }}
              >
                💬 Agendar Sessão Estratégica
              </button>
              <button onClick={handlePDF} style={{ background:"rgba(255,255,255,.06)", color:C.t1, border:"1px solid " + C.brd, borderRadius:10, padding:"12px 18px", fontSize:14, cursor:"pointer", fontFamily:F.nunito }}>
                ↓ PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EVENT TRACKING (conecta com o Dashboard de Métricas) ─────────
// Gera sessionId único por visita e persiste no localStorage
function getSessionId() {
  let sid = sessionStorage.getItem("z_session");
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    sessionStorage.setItem("z_session", sid);
  }
  return sid;
}
function trackEvent(stage, ucId) {
  try {
    // 1. Salva no localStorage (Dashboard de Métricas)
    const events = JSON.parse(localStorage.getItem("zenvia_events") || "[]");
    events.push({ id: getSessionId(), stage, uc: ucId || null, ts: Date.now() });
    localStorage.setItem("zenvia_events", JSON.stringify(events));

    // 2. Envia para Google Analytics 4 (relatórios em tempo real)
    const GA4_NAMES = {
      landing:    "diagnostico_abertura",
      cta_click:  "diagnostico_cta_clicado",
      usecase:    "diagnostico_objetivo_escolhido",
      onboarding: "diagnostico_empresa_preenchida",
      assessment: "diagnostico_perguntas_iniciadas",
      results:    "diagnostico_resultado_visto",
      pdf:        "diagnostico_pdf_baixado",
    };
    if (typeof gtag !== "undefined") {
      gtag("event", GA4_NAMES[stage] || stage, {
        event_category:  "Funil Diagnóstico",
        event_label:     ucId || "geral",
        caso_de_uso:     ucId || "nenhum",
        etapa_do_funil:  stage,
      });
    }
  } catch(e) {}
}

// ── APP ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [screen,    setScreen]    = useState(() => { trackEvent("landing"); return "landing"; });
  const [ucId,      setUcId]      = useState(null);
  const [ctx,       setCtx]       = useState({});
  const [responses, setResponses] = useState({});
  const [scores,    setScores]    = useState(null);
  const [narrative, setNarrative] = useState(null);

  async function handleProcessingDone() {
    const s = calcScores(responses, ucId);
    s._resp = responses;
    setScores(s);
    trackEvent("results", ucId);
    setScreen("results");
    const n = await fetchNarrative(s, ctx, ucId);
    if (n) setNarrative(n);
  }

  return (
    <>
      <GlobalStyles />
      {screen === "landing"  && <Landing onStart={() => setScreen("usecase")} />}
      {screen === "usecase"  && (
        <UseCaseSelector
          onBack={() => setScreen("landing")}
          onSelect={id => { setUcId(id); setScreen("onboarding"); trackEvent("usecase", id); }}
        />
      )}
      {screen === "onboarding" && ucId && (
        <Onboarding
          ucId={ucId}
          onBack={() => setScreen("usecase")}
          onNext={c => { setCtx(c); setScreen("assessment"); trackEvent("onboarding", ucId); }}
        />
      )}
      {screen === "assessment" && ucId && (
        <Assessment
          ucId={ucId}
          onBack={() => setScreen("onboarding")}
          onComplete={r => { setResponses(r); setScreen("processing"); trackEvent("assessment", ucId); }}
        />
      )}
      {screen === "processing" && ucId && (
        <Processing ucId={ucId} onDone={handleProcessingDone} />
      )}
      {screen === "results" && scores && ucId && (
        <Results scores={scores} ctx={ctx} ucId={ucId} narrative={narrative} onBack={() => setScreen("landing")} />
      )}
    </>
  );
}
