import React, { useState, useMemo } from 'react';
import { VENDORS_DATA, VendorProfile } from '../data/vendorData';
import { 
  DollarSign, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Sliders, 
  Cpu, 
  Droplets, 
  Layers, 
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Building2,
  FileCheck
} from 'lucide-react';

interface VendorTcoComparisonProps {
  onSimulateWithVendor?: (vendorId: string) => void;
}

export const VendorTcoComparison: React.FC<VendorTcoComparisonProps> = ({
  onSimulateWithVendor,
}) => {
  // Simulator state
  const [itCapacityMw, setItCapacityMw] = useState<number>(40);
  const [electricityTariffUsdMwh, setElectricityTariffUsdMwh] = useState<number>(65);
  const [lifespanYears, setLifespanYears] = useState<number>(10);
  const [aiLoadFactor, setAiLoadFactor] = useState<number>(90); // 90% continuous utilization
  const [activeTab, setActiveTab] = useState<'tco_simulator' | 'tech_matrix' | 'geopolitical_verdict'>('tco_simulator');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('huawei');

  const selectedVendor = VENDORS_DATA.find((v) => v.id === selectedVendorId) || VENDORS_DATA[0];

  // Mathematical TCO Calculations per vendor
  const tcoResults = useMemo(() => {
    return VENDORS_DATA.map((vendor) => {
      const facilityPowerMw = itCapacityMw * vendor.averagePueAi;
      const initialCapexUsd = itCapacityMw * vendor.capexIndexUsdPerMw;
      
      // Annual energy consumption = Facility MW * 8760 hrs * loadFactor
      const annualMwh = facilityPowerMw * 8760 * (aiLoadFactor / 100);
      const annualElectricityCostUsd = annualMwh * electricityTariffUsdMwh;
      
      // Annual maintenance & parts SLA
      const annualMaintenanceCostUsd = initialCapexUsd * (vendor.opexAnnualMaintPercent / 100);
      
      const totalElectricityCostHorizon = annualElectricityCostUsd * lifespanYears;
      const totalMaintenanceCostHorizon = annualMaintenanceCostUsd * lifespanYears;
      const totalOpexHorizon = totalElectricityCostHorizon + totalMaintenanceCostHorizon;
      
      const totalTcoUsd = initialCapexUsd + totalOpexHorizon;

      return {
        vendor,
        facilityPowerMw,
        initialCapexUsd,
        annualElectricityCostUsd,
        annualMaintenanceCostUsd,
        totalElectricityCostHorizon,
        totalMaintenanceCostHorizon,
        totalOpexHorizon,
        totalTcoUsd,
        leadTimeWeeks: vendor.leadTimeWeeks,
      };
    });
  }, [itCapacityMw, electricityTariffUsdMwh, lifespanYears, aiLoadFactor]);

  // Find lowest CapEx and lowest OpEx for benchmarks
  const lowestCapex = Math.min(...tcoResults.map((r) => r.initialCapexUsd));
  const lowestTco = Math.min(...tcoResults.map((r) => r.totalTcoUsd));

  const formatCurrencyM = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-10">
      {/* Header & Strategic Context */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Dossiê Comparativo de Fornecedores · Bruno Zavaleta DataCenter</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Huawei vs. Concorrentes (Vertiv, Schneider, Eaton)
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Estudo técnico-financeiro detalhado confrontando o custo de capital (<strong className="text-slate-900 font-semibold">CapEx</strong>), despesas operacionais de longo prazo (<strong className="text-slate-900 font-semibold">OpEx</strong>), eficiência térmica (PUE), prazos de entrega e restrições geopolíticas nas Américas.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-2">
          <button
            onClick={() => setActiveTab('tco_simulator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tco_simulator'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Simulador Paramétrico CapEx vs. OpEx</span>
          </button>
          <button
            onClick={() => setActiveTab('tech_matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tech_matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Matriz Técnica de Soluções (Potência, Líquido & Pré-fab)</span>
          </button>
          <button
            onClick={() => setActiveTab('geopolitical_verdict')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'geopolitical_verdict'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>Veredito Estratégico & Conformidade Geopolítica</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TCO & CapEx/OpEx Simulator */}
      {activeTab === 'tco_simulator' && (
        <div className="space-y-8">
          {/* Executive KPI Summary Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase">Vantagem de CapEx Inicial</div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                Huawei ~21% mais econômica
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Economia de até {formatCurrencyM(tcoResults[1].initialCapexUsd - tcoResults[0].initialCapexUsd)} em uma instalação de {itCapacityMw} MW frente aos líderes ocidentais.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase">Velocidade de Energização (Time-to-Market)</div>
              <div className="text-xl font-bold font-mono text-amber-700 mt-1">
                16 a 24 semanas vs 36 a 52 semanas
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Huawei possui cadeia integrada de montagem que antecipa em até 6 a 8 meses a receita de aluguel/processamento de IA.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase">Homologação de Hiperescalas dos EUA</div>
              <div className="text-xl font-bold font-mono text-cyan-800 mt-1">
                Vertiv & Schneider = Padrão Global
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Exigência mandatória para contratos diretos com AWS, Microsoft, Google e Meta devido a leis de cibersegurança dos EUA (NDAA).
              </p>
            </div>
          </div>

          {/* Controls Bar for Simulation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Parâmetros do Datacenter para Cálculo de TCO</h3>
              </div>
              <span className="text-xs text-slate-500">Ajuste os valores para recalcular em tempo real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* IT Capacity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Carga Crítica de TI:</span>
                  <span className="font-mono font-bold text-slate-900">{itCapacityMw} MW</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={itCapacityMw}
                  onChange={(e) => setItCapacityMw(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 MW</span>
                  <span>120 MW (Gigacluster)</span>
                </div>
              </div>

              {/* Electricity Tariff */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Tarifa Elétrica:</span>
                  <span className="font-mono font-bold text-slate-900">${electricityTariffUsdMwh}/MWh</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="2"
                  value={electricityTariffUsdMwh}
                  onChange={(e) => setElectricityTariffUsdMwh(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>$40 (Nordeste/Quebec)</span>
                  <span>$120 (Caribe/PJM)</span>
                </div>
              </div>

              {/* Lifespan */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Horizonte de Análise:</span>
                  <span className="font-mono font-bold text-slate-900">{lifespanYears} anos</span>
                </div>
                <div className="flex items-center gap-2">
                  {[5, 10, 15].map((years) => (
                    <button
                      key={years}
                      onClick={() => setLifespanYears(years)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        lifespanYears === years
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {years} anos
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">Ciclo de vida de infraestrutura elétrica</div>
              </div>

              {/* AI Load Factor */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Fator de Utilização de IA:</span>
                  <span className="font-mono font-bold text-slate-900">{aiLoadFactor}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  step="2"
                  value={aiLoadFactor}
                  onChange={(e) => setAiLoadFactor(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>70% (Inferência variável)</span>
                  <span>98% (Treino LLM contínuo)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {tcoResults.map(({ vendor, initialCapexUsd, annualElectricityCostUsd, annualMaintenanceCostUsd, totalOpexHorizon, totalTcoUsd, leadTimeWeeks }) => {
              const isSelected = vendor.id === selectedVendorId;
              const capexDeltaPercent = ((initialCapexUsd - lowestCapex) / lowestCapex) * 100;
              const tcoDeltaPercent = ((totalTcoUsd - lowestTco) / lowestTco) * 100;

              return (
                <div
                  key={vendor.id}
                  onClick={() => setSelectedVendorId(vendor.id)}
                  className={`rounded-2xl border transition-all cursor-pointer p-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header with Origin & Flag */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl" role="img" aria-label={vendor.origin}>{vendor.flag}</span>
                        <div>
                          <div className="font-bold text-base text-slate-900 leading-tight">{vendor.name}</div>
                          <div className="text-[11px] text-slate-500">{vendor.origin} · {vendor.marketShareGlobal}</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Breakdown */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      {/* CapEx Initial */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                          <span>CapEx Inicial Estimado</span>
                          {capexDeltaPercent === 0 ? (
                            <span className="text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.5 rounded text-[10px]">
                              Menor CapEx
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[10px]">
                              +{capexDeltaPercent.toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                          {formatCurrencyM(initialCapexUsd)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ${(vendor.capexIndexUsdPerMw / 1000000).toFixed(2)}M por MW de TI
                        </div>
                      </div>

                      {/* OpEx Acumulado */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                          <span>OpEx Acumulado ({lifespanYears}a)</span>
                          <span className="text-slate-700 font-mono font-bold">PUE {vendor.averagePueAi}</span>
                        </div>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                          {formatCurrencyM(totalOpexHorizon)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 space-y-0.5">
                          <div>Energia: {formatCurrencyM(annualElectricityCostUsd)}/ano</div>
                          <div>Manutenção SLA: {formatCurrencyM(annualMaintenanceCostUsd)}/ano</div>
                        </div>
                      </div>

                      {/* Total TCO */}
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                        <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                          <span>TCO Total ({lifespanYears} anos)</span>
                          {tcoDeltaPercent === 0 ? (
                            <span className="text-emerald-700 font-bold text-[10px]">Melhor TCO</span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[10px]">+{tcoDeltaPercent.toFixed(0)}%</span>
                          )}
                        </div>
                        <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">
                          {formatCurrencyM(totalTcoUsd)}
                        </div>
                        <div className="text-[10px] text-emerald-700 mt-0.5">
                          CapEx + OpEx Operacional Completo
                        </div>
                      </div>

                      {/* Lead Time & Hyperscaler Status */}
                      <div className="space-y-1.5 pt-1 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-600" />
                            <span>Prazo de Entrega:</span>
                          </span>
                          <span className="font-bold text-slate-800">{leadTimeWeeks}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-cyan-700" />
                            <span>Aceitação EUA:</span>
                          </span>
                          <span className={`font-bold ${vendor.geopoliticalAndCompliance.usNdaaCompliance ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {vendor.geopoliticalAndCompliance.usHyperscalerAcceptance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select button */}
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <button
                      onClick={() => setSelectedVendorId(vendor.id)}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{isSelected ? 'Inspecionando Solução' : 'Comparar Detalhes'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Technology Architecture & Solutions Breakdown */}
      {activeTab === 'tech_matrix' && (
        <div className="space-y-8">
          {/* Sub-Selector for Vendor Inspection */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Detalhamento dos Subsistemas Tecnológicos para IA
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativo linha a linha de no-breaks, refrigeração líquida, módulos pré-fabricados e software DCIM
              </p>
            </div>

            <div className="flex items-center gap-2">
              {VENDORS_DATA.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendorId(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedVendorId === v.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{v.flag}</span>
                  <span>{v.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deep Inspection Panel for Selected Vendor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={selectedVendor.origin}>{selectedVendor.flag}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Solução de Arquitetura {selectedVendor.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Origem: {selectedVendor.origin} · PUE Típico em IA: <strong className="text-emerald-700 font-bold">{selectedVendor.averagePueAi}</strong> · Prazo: {selectedVendor.leadTimeWeeks}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  CapEx: ${(selectedVendor.capexIndexUsdPerMw / 1000000).toFixed(2)}M / MW
                </span>
              </div>
            </div>

            {/* 4 Pillars of Datacenter Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Power & UPS POD */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <span>1. Distribuição de Energia & No-breaks</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {selectedVendor.powerPodSolution.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedVendor.powerPodSolution.description}
                </p>
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eficiência Elétrica:</span>
                    <span className="font-bold text-slate-800">{selectedVendor.powerPodSolution.efficiencyRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ocupação de Espaço:</span>
                    <span className="font-bold text-emerald-700">{selectedVendor.powerPodSolution.footprintFootprintReduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tecnologia BESS/Bateria:</span>
                    <span className="font-bold text-slate-800">{selectedVendor.powerPodSolution.bessTech}</span>
                  </div>
                </div>
              </div>

              {/* 2. Cooling for AI */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 uppercase tracking-wide">
                    <Droplets className="h-4 w-4 text-cyan-600" />
                    <span>2. Refrigeração Líquida & Gestão Térmica</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {selectedVendor.coolingSolution.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedVendor.coolingSolution.techHighlights}
                </p>
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo de Refrigeração:</span>
                    <span className="font-bold text-slate-800">{selectedVendor.coolingSolution.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Densidade Máxima por Rack:</span>
                    <span className="font-bold text-purple-700">{selectedVendor.coolingSolution.maxDensityPerRackKw} kW / rack</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consumo Hídrico (WUE):</span>
                    <span className="font-bold text-emerald-700">{selectedVendor.coolingSolution.waterConsumptionLitrePerKwh} L/kWh</span>
                  </div>
                </div>
              </div>

              {/* 3. Prefabricated Modular DC */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wide">
                    <Building2 className="h-4 w-4 text-amber-600" />
                    <span>3. Solução Modular Pré-fabricada</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {selectedVendor.modularPrefabSolution.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedVendor.modularPrefabSolution.description}
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tempo de Implantação Modular:</span>
                  <span className="font-bold text-amber-800">
                    {selectedVendor.modularPrefabSolution.deploymentTimeMonths} meses (Plug & Play)
                  </span>
                </div>
              </div>

              {/* 4. DCIM & Predictive Software */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wide">
                    <Cpu className="h-4 w-4 text-indigo-600" />
                    <span>4. Software DCIM & Gestão por IA</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {selectedVendor.dcimSoftware.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedVendor.dcimSoftware.aiFeatures}
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Otimização Térmica Preditiva:</span>
                  <span className="font-bold text-indigo-700">Nativo via Machine Learning</span>
                </div>
              </div>
            </div>

            {/* Pros and Cons Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Vantagens Competitivas de {selectedVendor.name}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedVendor.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Limitações & Pontos de Atenção</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedVendor.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Geopolitical & Strategic Verdict */}
      {activeTab === 'geopolitical_verdict' && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
                Análise de Decisão Executiva
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                Qual Fornecedor Escolher para o seu Datacenter nas Américas?
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                A resposta não é universal e depende exclusivamente do perfil do cliente final, da localização geográfica do sítio e da urgência de entrada em operação.
              </p>
            </div>

            {/* Decision Framework 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option A: Huawei */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Cenário 1: Menor Custo & Time-to-Market Urgente
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Escolha Huawei Digital Power
                  </h4>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Quando aplicar:</strong> Projetos construídos no Brasil, México, Chile ou Colômbia voltados para operadoras de telecomunicações, empresas locais de nuvem, IA privada corporativa e modelos soberanos de IA.
                  </p>
                  <p>
                    <strong>Por que vence:</strong> O CapEx é até <strong>25% menor</strong> e o tempo de entrega é de apenas <strong>16 a 24 semanas</strong>, contra quase um ano nos concorrentes. Se o seu projeto não precisa de certificação federal dos EUA, a Huawei oferece a melhor relação preço-desempenho e o menor PUE nativo (1.15).
                  </p>
                </div>
                <div className="pt-3 border-t border-emerald-200 text-[11px] font-bold text-emerald-900">
                  Ideal para: Telecoms, Nuvem Regional LATAM e Provedores Privados de IA
                </div>
              </div>

              {/* Option B: Vertiv */}
              <div className="rounded-xl border border-blue-300 bg-blue-50/40 p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                    Cenário 2: Hyperscale Anchor Tenants dos EUA
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Escolha Vertiv
                  </h4>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Quando aplicar:</strong> Datacenters desenvolvidos para locação integral (*Wholesale Colocation*) com contratos de longo prazo (10-15 anos) ancorados em gigantes norte-americanas (AWS, Microsoft, Google, Meta, Oracle).
                  </p>
                  <p>
                    <strong>Por que vence:</strong> A Vertiv é o padrão global homologado por essas empresas e possui arquitetura de referência com a NVIDIA para nós de GPU de alta densidade (GB200 NVL72). 100% de conformidade com NDAA/EUA e rede de assistência global irrestrita.
                  </p>
                </div>
                <div className="pt-3 border-t border-blue-200 text-[11px] font-bold text-blue-900">
                  Ideal para: Wholesale Hyperscale, Fundos de Infraestrutura dos EUA e Clusters NVIDIA
                </div>
              </div>

              {/* Option C: Schneider Electric / Eaton */}
              <div className="rounded-xl border border-purple-300 bg-purple-50/40 p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-800 uppercase tracking-wide">
                    Cenário 3: Média Tensão Unificada, ESG & Microrrede
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Escolha Schneider ou Eaton
                  </h4>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Quando aplicar:</strong> Projetos com alta exigência de governança ESG, onde a mesma empresa fornece desde a subestação de 138kV até o barramento do rack (Schneider), ou onde se deseja monetizar o BESS com a concessionária via no-breaks interativos com a rede (Eaton EnergyAware).
                  </p>
                  <p>
                    <strong>Por que vence:</strong> A Schneider tem a melhor integração elétrica de média e baixa tensão do mundo e rastreamento rigoroso de carbono incorporado; a Eaton lidera em microrredes industriais.
                  </p>
                </div>
                <div className="pt-3 border-t border-purple-200 text-[11px] font-bold text-purple-900">
                  Ideal para: Auditorias ESG estritas, Bancos e Integração direta com Subestações de Concessionárias
                </div>
              </div>
            </div>

            {/* Geopolitical Risk & Hyperscaler Table */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                <span>Matriz de Conformidade Regulatória e Aceitação nas Américas</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-3">Fabricante</th>
                      <th className="p-3">Conformidade US NDAA</th>
                      <th className="p-3">Aceitação por Big Techs dos EUA</th>
                      <th className="p-3">Presença & Suporte na América Latina</th>
                      <th className="p-3">Prazo de Entrega Típico</th>
                      <th className="p-3">CapEx Indicativo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {VENDORS_DATA.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span>{v.flag}</span>
                          <span>{v.name}</span>
                        </td>
                        <td className="p-3">
                          {v.geopoliticalAndCompliance.usNdaaCompliance ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Conforme
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                              <AlertTriangle className="h-3.5 w-3.5" /> Não Conforme (Restrito nos EUA)
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium">
                          {v.geopoliticalAndCompliance.usHyperscalerAcceptance}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs">
                          {v.geopoliticalAndCompliance.latamSupportNetwork}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {v.leadTimeWeeks}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-800">
                          ${(v.capexIndexUsdPerMw / 1000000).toFixed(2)}M/MW
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
