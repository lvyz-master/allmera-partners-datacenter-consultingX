import React from 'react';
import { ArrowUpRight, Zap, Globe, Droplets, Map, Scale } from 'lucide-react';

interface ExecutiveSummaryProps {
  onNavigateTab: (tab: string) => void;
  onSelectRegion: (regionId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  onNavigateTab,
  onSelectRegion,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section on White Canvas */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Plataforma de Inteligência · Allmera Partners Data Center Consulting</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              Infraestrutura Elétrica, Latência & Sustentabilidade para Datacenters de IA
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              A revolução dos modelos de IA generativa e clusters de supercomputação de alta densidade (40kW a 100kW+ por rack) esbarra no <span className="text-slate-900 font-semibold">"Power Wall"</span> dos mercados maduros da América do Norte. Descubra como os mercados emergentes da América Latina (Brasil, México, Chile, Colômbia) combinam matrizes limpas, regimes de autoprodução e conectividade submarina para capturar a próxima onda de expansão.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('map')}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
              >
                <Map className="h-4 w-4" />
                <span>Ver no Mapa Continental</span>
              </button>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-900 transition-all shadow-2xs cursor-pointer"
              >
                <span>Simular Viabilidade</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigateTab('regions')}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <span>Explorar 10 Polos</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 aspect-[16/10] shadow-md">
              <img
                src="/src/assets/images/hero_ai_datacenter_1791072802880.jpg"
                alt="Hyperscale AI Data Center Campus with Solar Arrays and Substation"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-200">
                <span className="font-semibold text-white">Campus Hyperscale de Próxima Geração</span>
                <span className="mx-2 text-slate-400">·</span>
                <span>Interconexão 230kV + Geração Renovável</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Quantitative Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-200 bg-slate-50/90 divide-x divide-y md:divide-y-0 divide-slate-200">
          <div className="p-4 sm:p-5">
            <div className="text-xs text-slate-500 font-medium">Fila Média de Subestação (EUA - PJM)</div>
            <div className="mt-1 text-2xl font-bold font-mono text-amber-600 tabular-nums">48 - 72 meses</div>
            <div className="text-[11px] text-slate-500 mt-1">Saturação da Dominion Energy & PJM</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-slate-500 font-medium">Fila de Conexão (LATAM - Hubs)</div>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-600 tabular-nums">18 - 36 meses</div>
            <div className="text-[11px] text-slate-500 mt-1">Vantagem de Time-to-Market de 2 a 3 anos</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-slate-500 font-medium">Matriz Limpa (Brasil & Quebec)</div>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-700 tabular-nums">88% - 99%</div>
            <div className="text-[11px] text-slate-500 mt-1">Hidroelétrica, eólica e solar contínuas</div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="text-xs text-slate-500 font-medium">Latência Submarina Fortaleza - Miami</div>
            <div className="mt-1 text-2xl font-bold font-mono text-cyan-700 tabular-nums">65 ms RTT</div>
            <div className="text-[11px] text-slate-500 mt-1">Sistemas Seabras-1, Monet e Firmina</div>
          </div>
        </div>
      </section>

      {/* Strategic Triad Section */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Pilares Críticos do Negócio de Datacenters de IA
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Análise aprofundada dos três gargalos que definem a alocação de bilhões de dólares em capital de infraestrutura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                1. O "Power Wall" & Desafio da Rede
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Superclusters de treino (ex: clusters de 32k a 100k GPUs) demandam de 50 MW a 300 MW por campus. Nos polos tradicionais (Northern Virginia, Vale do Silício), a capacidade de subestações de 500kV está exaurida. Desenvolvedores são forçados a construir subestações dedicadas e co-localizar com usinas de geração ou migrar para regiões emergentes com espaço no grid.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Impacto: CapEx & Time-to-Market</span>
              <button
                onClick={() => onNavigateTab('grid')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver análise da rede</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                2. Latência: Treinamento vs. Inferência
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nem toda carga de IA tem o mesmo requisito. O <span className="text-slate-900 font-semibold">treinamento de LLMs</span> roda de forma assíncrona; o paralelismo de nós é resolvido internamente por InfiniBand/RoCE a &lt;2µs, tolerando latências de 40ms a 80ms para ingestão de dados. Já a <span className="text-slate-900 font-semibold">inferência em tempo real</span> exige &lt;20ms próximo ao usuário corporativo e financeiro.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Impacto: Localização do Sítio</span>
              <button
                onClick={() => onNavigateTab('latency')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver rotas de fibra</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Droplets className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                3. Sustentabilidade & Desafio Hídrico
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Com racks de 80kW+, torres evaporativas convencionais consomem milhões de litros de água por dia. Em Querétaro (México) e Santiago (Chile), a escassez de água gerou moratórias e proibições de licenciamento. A sustentabilidade operacional agora exige <span className="text-slate-900 font-semibold">Direct-to-Chip Liquid Cooling</span> de circuito fechado com zero consumo hídrico e PPAs renováveis 24/7.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Impacto: Licenciamento ESG</span>
              <button
                onClick={() => onNavigateTab('regulatory')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver marcos legais</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Continental Map Spotlight Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Map className="h-4 w-4" />
            <span>Cartografia Interativa das Américas</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Explore Visualmente a Fila de Conexão, Matriz Limpa & Cabos Submarinos
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Consulte visualmente os tempos de espera em subestações de alta tensão, rotas de cabos transoceânicos (Firmina, Monet, Curie, EllaLink), tarifas em $/MWh e restrições de água em tempo real.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('map')}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-3 text-xs font-bold text-white transition-all shadow-xs cursor-pointer group"
        >
          <span>Abrir Mapa Continental Interativo</span>
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </section>

      {/* Vendor Comparison Study Spotlight Banner */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Scale className="h-4 w-4 text-emerald-600" />
            <span>Estudo Exclusivo de Soluções & Fornecedores</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Huawei Digital Power vs. Concorrentes (Vertiv, Schneider Electric, Eaton)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Avalie o custo de capital (<strong className="text-slate-900 font-semibold">CapEx</strong> ~21% menor na Huawei), despesas operacionais (<strong className="text-slate-900 font-semibold">OpEx</strong>), lead time de entrega (16 vs 48 semanas) e restrições geopolíticas (homologação NDAA/EUA para hiperescalas).
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('vendors')}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-xs font-bold text-white transition-all shadow-xs cursor-pointer group"
        >
          <span>Acessar Estudo CapEx & OpEx</span>
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </section>

      {/* Fast Region Route Quick Bar */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Principais Polos Analisados nas Américas</h3>
            <p className="text-xs text-slate-500">Acesse instantaneamente o dossiê elétrico e regulatório de cada jurisdição</p>
          </div>
          <button
            onClick={() => onNavigateTab('regions')}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            Ver todos (12)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'br-sp', label: 'São Paulo', flag: '🇧🇷', subtitle: 'Polo Líder LATAM' },
            { id: 'br-ce', label: 'Fortaleza', flag: '🇧🇷', subtitle: 'Hub Cabos Submarinos' },
            { id: 'mx-qro', label: 'Querétaro', flag: '🇲🇽', subtitle: 'Epicentro México' },
            { id: 'cl-stgo', label: 'Santiago', flag: '🇨🇱', subtitle: 'Pacífico Sul' },
            { id: 'co-bog', label: 'Bogotá', flag: '🇨🇴', subtitle: 'Free Cooling Natural' },
            { id: 'us-tx', label: 'Texas ERCOT', flag: '🇺🇸', subtitle: 'Gigawatts de IA' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectRegion(item.id);
                onNavigateTab('regions');
              }}
              className="text-left rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/90 p-3 hover:border-emerald-400 transition-all cursor-pointer group"
            >
              <div className="text-xl mb-1">{item.flag}</div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
