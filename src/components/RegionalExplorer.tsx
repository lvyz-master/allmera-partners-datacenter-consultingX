import React, { useState } from 'react';
import { REGIONS_DATA } from '../data/regionsData';
import { RegionData } from '../types/datacenter';
import { Search, Zap, Globe, Shield, CheckCircle2, AlertTriangle, ArrowRight, Cpu, Droplets } from 'lucide-react';

interface RegionalExplorerProps {
  selectedRegionId: string;
  onSelectRegionId: (id: string) => void;
  onOpenAiAssessment: (region: RegionData) => void;
  onSimulateRegion: (regionId: string) => void;
}

export const RegionalExplorer: React.FC<RegionalExplorerProps> = ({
  selectedRegionId,
  onSelectRegionId,
  onOpenAiAssessment,
  onSimulateRegion,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'emerging' | 'mature'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'grid' | 'latency' | 'regulatory' | 'workload'>('grid');

  const filteredRegions = REGIONS_DATA.filter((region) => {
    const matchesTier = filterTier === 'all' || region.marketTier === filterTier;
    const matchesSearch =
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.hubRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const selectedRegion = REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Explorador de Polos Regionais das Américas
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Compare capacidade de subestação, filas de rede, matriz renovável e conectividade entre mercados emergentes e maduros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar país ou polo..."
              className="w-48 sm:w-60 rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Segmented Tier Filter (Functional Tab Control) */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setFilterTier('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filterTier === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({REGIONS_DATA.length})
            </button>
            <button
              onClick={() => setFilterTier('emerging')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filterTier === 'emerging'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mercados Emergentes ({REGIONS_DATA.filter((r) => r.marketTier === 'emerging').length})
            </button>
            <button
              onClick={() => setFilterTier('mature')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                filterTier === 'mature'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Polos Maduros ({REGIONS_DATA.filter((r) => r.marketTier === 'mature').length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Region Selector (left/top) + Deep Dive Panel (right/bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Region List Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[780px] overflow-y-auto pr-1">
          {filteredRegions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Nenhuma região encontrada para o filtro selecionado.
            </div>
          ) : (
            filteredRegions.map((region) => {
              const isSelected = region.id === selectedRegion.id;
              return (
                <div
                  key={region.id}
                  onClick={() => onSelectRegionId(region.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label={region.country}>
                        {region.flag}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{region.name}</h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{region.country}</span>
                          <span aria-hidden="true">·</span>
                          <span className={region.marketTier === 'emerging' ? 'text-emerald-700 font-medium' : 'text-slate-700'}>
                            {region.marketTier === 'emerging' ? 'Mercado Emergente' : 'Polo Maduro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        ${region.grid.averageIndustrialTariffUsdMwh}
                        <span className="text-[10px] text-slate-500 font-normal">/MWh</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-700 tabular-nums font-semibold">
                        {region.grid.gridRenewablePercentage}% limpa
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {region.hubRole}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        Fila:{' '}
                        <strong className="text-slate-800 font-mono tabular-nums">
                          {region.grid.interconnectionQueueMonths}m
                        </strong>
                      </span>
                      <span>·</span>
                      <span>
                        Capacidade:{' '}
                        <strong className="text-slate-800 font-mono tabular-nums">
                          {region.grid.availableCapacityMw} MW
                        </strong>
                      </span>
                    </div>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Ver detalhes
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Region Deep-Dive Details */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={selectedRegion.country}>
                {selectedRegion.flag}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                  {selectedRegion.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{selectedRegion.country}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">
                    {selectedRegion.marketTier === 'emerging' ? 'Mercado Emergente LATAM' : 'Polo Consolidado América do Norte'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Tensão: {selectedRegion.grid.substationVoltageKv}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAiAssessment(selectedRegion)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Parecer Gemini IA</span>
              </button>
              <button
                onClick={() => onSimulateRegion(selectedRegion.id)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>Simular Carga</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {[
              { id: 'grid', label: 'Infraestrutura Elétrica', icon: Zap },
              { id: 'latency', label: 'Latência & Conexões', icon: Globe },
              { id: 'regulatory', label: 'Marco Regulatório', icon: Shield },
              { id: 'workload', label: 'Perfil de IA & Score', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-emerald-800 font-semibold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Grid Infrastructure */}
          {activeSubTab === 'grid' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="text-[11px] text-slate-500 font-medium">Capacidade Disponível</div>
                  <div className="mt-1 text-lg font-bold font-mono text-emerald-700 tabular-nums">
                    {selectedRegion.grid.availableCapacityMw} MW
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Pipeline: {selectedRegion.grid.pipelineCapacityMw} MW</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="text-[11px] text-slate-500 font-medium">Fila de Conexão</div>
                  <div className="mt-1 text-lg font-bold font-mono text-amber-700 tabular-nums">
                    {selectedRegion.grid.interconnectionQueueMonths} meses
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Estudo + Obra Subestação</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="text-[11px] text-slate-500 font-medium">Tarifa Média Industrial</div>
                  <div className="mt-1 text-lg font-bold font-mono text-slate-900 tabular-nums">
                    ${selectedRegion.grid.averageIndustrialTariffUsdMwh}
                    <span className="text-[10px] text-slate-500 font-normal">/MWh</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Antes de desconto autoprodução</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="text-[11px] text-slate-500 font-medium">Matriz Renovável</div>
                  <div className="mt-1 text-lg font-bold font-mono text-emerald-700 tabular-nums">
                    {selectedRegion.grid.gridRenewablePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Fóssil: {selectedRegion.grid.fossilPercentage}%</div>
                </div>
              </div>

              {/* Grid Reliability & Bottlenecks */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Diagnóstico de Rede & Estabilidade de Tensão
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500">Confiabilidade Técnica (SAIDI / SAIFI):</span>
                    <p className="mt-0.5 font-mono text-slate-900 tabular-nums">
                      SAIDI: {selectedRegion.grid.saidiHoursPerYear} horas/ano · SAIFI: {selectedRegion.grid.saifiEventsPerYear} interrupções/ano
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Necessidade de BESS (Baterias):</span>
                    <p className="mt-0.5 font-semibold text-emerald-800">
                      {selectedRegion.grid.bessNecessity} (Estabilização de frequência para GPU spikes)
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Gargalo de Transmissão Local:</span>
                    <p className="mt-0.5 text-slate-700 leading-relaxed">
                      {selectedRegion.grid.transmissionBottleneck}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Latency & Connectivity */}
          {activeSubTab === 'latency' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Matriz de Round-Trip Time (RTT) para Principais IXs
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Threshold Inferência Viável: &lt; 25ms
                  </span>
                </div>

                <div className="divide-y divide-slate-200 text-xs">
                  {selectedRegion.latency.map((node, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          <span>{node.target}</span>
                          <span className="text-[10px] text-slate-500">({node.routeType})</span>
                        </div>
                        {node.cableSystems && (
                          <div className="text-[11px] text-slate-500">
                            Cabos: {node.cableSystems.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-sm text-cyan-800 tabular-nums">
                          {node.rttMs} ms
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            node.inferenceViable
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {node.inferenceViable ? 'Inferência Real-time' : 'Treinamento / Assíncrono'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Regulatory & Sustainability */}
          {activeSubTab === 'regulatory' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-3.5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1">
                  <div className="font-semibold text-emerald-800">Regime de Autoprodução & PPA</div>
                  <p className="text-slate-700 leading-relaxed">{selectedRegion.regulatory.selfGenerationRegime}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1">
                  <div className="font-semibold text-emerald-800">Isenções de Encargos & Subsídios de Rede</div>
                  <p className="text-slate-700 leading-relaxed">{selectedRegion.regulatory.exemptionsAndSubsidies}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1">
                  <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5" />
                    <span>Estresse Hídrico & Regulamentação de Refrigeração</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1">
                    Nível de Estresse: <strong className="text-slate-800">{selectedRegion.regulatory.waterStressLevel}</strong> · Tempo Licenciamento Ambiental: <strong className="text-slate-800">{selectedRegion.regulatory.environmentalPermitMonths} meses</strong>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedRegion.regulatory.coolingRegulations}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1">
                  <div className="font-semibold text-cyan-800">Incentivos Fiscais e Zonas Especiais</div>
                  <p className="text-slate-700 leading-relaxed">{selectedRegion.regulatory.taxIncentives}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Workload Fit & AI Scorecard */}
          {activeSubTab === 'workload' && (
            <div className="space-y-5">
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                {selectedRegion.primaryWorkloadSuitability.summary}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Treino LLM</div>
                  <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                    {selectedRegion.primaryWorkloadSuitability.llmTrainingScore}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sensível a custo/MW</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Inferência Real-time</div>
                  <div className="text-2xl font-bold font-mono text-cyan-800 mt-1 tabular-nums">
                    {selectedRegion.primaryWorkloadSuitability.realtimeInferenceScore}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sensível a RTT &lt;20ms</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-center">
                  <div className="text-[11px] text-slate-500 font-medium">Batch RAG / Assíncrono</div>
                  <div className="text-2xl font-bold font-mono text-purple-800 mt-1 tabular-nums">
                    {selectedRegion.primaryWorkloadSuitability.batchRAGScore}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Custo híbrido</div>
                </div>
              </div>

              {/* Key Advantages & Critical Risks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-2">
                  <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Principais Vantagens Competitivas</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {selectedRegion.keyAdvantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 shrink-0 font-bold">·</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Riscos Críticos de Desenvolvimento</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {selectedRegion.criticalRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 shrink-0 font-bold">·</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
