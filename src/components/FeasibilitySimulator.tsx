import React, { useState, useMemo } from 'react';
import { REGIONS_DATA } from '../data/regionsData';
import { WorkloadType } from '../types/datacenter';
import { Sliders, Zap, DollarSign, Leaf, Clock, BatteryCharging, Sparkles, ArrowRight } from 'lucide-react';

interface FeasibilitySimulatorProps {
  initialRegionId?: string;
  onRequestAiConsultation: (scenarioData: any) => void;
}

export const FeasibilitySimulator: React.FC<FeasibilitySimulatorProps> = ({
  initialRegionId = 'br-sp',
  onRequestAiConsultation,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>(initialRegionId);
  const [itLoadMw, setItLoadMw] = useState<number>(60);
  const [targetPue, setTargetPue] = useState<number>(1.18);
  const [coolingTech, setCoolingTech] = useState<'direct_liquid' | 'evaporative' | 'closed_adiabatic'>('direct_liquid');
  const [workload, setWorkload] = useState<WorkloadType>('training');
  const [renewableSelfGenPercent, setRenewableSelfGenPercent] = useState<number>(70);
  const [bessHours, setBessHours] = useState<number>(2);

  const region = useMemo(() => {
    return REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];
  }, [selectedRegionId]);

  // Calculations
  const results = useMemo(() => {
    const totalFacilityPowerMw = itLoadMw * targetPue;
    const loadFactor = workload === 'training' ? 0.94 : workload === 'inference' ? 0.78 : 0.88;
    const annualHours = 8760;
    const annualEnergyConsumptionGwh = (totalFacilityPowerMw * annualHours * loadFactor) / 1000;

    // Base electricity cost
    const baseTariff = region.grid.averageIndustrialTariffUsdMwh;

    // Self-generation discount
    const selfGenDiscountFactor = region.country === 'Brasil' ? 0.28 : region.country === 'Estados Unidos' ? 0.15 : 0.18;
    const blendedTariff =
      baseTariff * (1 - (renewableSelfGenPercent / 100) * selfGenDiscountFactor);

    const annualPowerCostUsd = annualEnergyConsumptionGwh * 1000 * blendedTariff;

    // CapEx calculations
    const substationCapexUsd = totalFacilityPowerMw * region.grid.substationCostPerMwUsd;
    const bessCapacityMwh = totalFacilityPowerMw * bessHours;
    const bessCapexUsd = bessCapacityMwh * 280000;

    // Cooling CapEx
    const coolingCostPerMw =
      coolingTech === 'direct_liquid' ? 140000 : coolingTech === 'closed_adiabatic' ? 110000 : 75000;
    const liquidCoolingCapexUsd = itLoadMw * coolingCostPerMw;

    const totalInfraCapexUsd = substationCapexUsd + bessCapexUsd + liquidCoolingCapexUsd;

    // Emissions
    const fossilShare = (100 - region.grid.gridRenewablePercentage) / 100;
    const standardGridCo2Tons = (annualEnergyConsumptionGwh * 1000 * (fossilShare * 0.45 + (1 - fossilShare) * 0.015));

    const selfGenCleanShare = Math.max(region.grid.gridRenewablePercentage, renewableSelfGenPercent) / 100;
    const actualCo2Tons = (annualEnergyConsumptionGwh * 1000 * ((1 - selfGenCleanShare) * 0.45 + selfGenCleanShare * 0.015));
    const co2AvoidedTons = Math.max(0, standardGridCo2Tons - actualCo2Tons);

    let leadTimeMonths = region.grid.interconnectionQueueMonths;
    if (itLoadMw > 150) leadTimeMonths += 8;
    if (bessHours >= 2) leadTimeMonths += 2;

    return {
      totalFacilityPowerMw: Number(totalFacilityPowerMw.toFixed(1)),
      annualEnergyConsumptionGwh: Math.round(annualEnergyConsumptionGwh),
      annualPowerCostUsd: Math.round(annualPowerCostUsd),
      substationCapexUsd: Math.round(substationCapexUsd),
      bessCapexUsd: Math.round(bessCapexUsd),
      liquidCoolingCapexUsd: Math.round(liquidCoolingCapexUsd),
      totalInfraCapexUsd: Math.round(totalInfraCapexUsd),
      co2EmissionsTons: Math.round(actualCo2Tons),
      co2AvoidedTons: Math.round(co2AvoidedTons),
      estimatedLeadTimeMonths: leadTimeMonths,
      blendedTariff: Number(blendedTariff.toFixed(1)),
    };
  }, [region, itLoadMw, targetPue, coolingTech, workload, renewableSelfGenPercent, bessHours]);

  const handleLaunchAi = () => {
    onRequestAiConsultation({
      region: region.name,
      country: region.country,
      itLoadMw,
      targetPue,
      totalFacilityPowerMw: results.totalFacilityPowerMw,
      coolingTech,
      workload,
      renewableSelfGenPercent,
      bessHours,
      annualEnergyConsumptionGwh: results.annualEnergyConsumptionGwh,
      annualPowerCostUsd: results.annualPowerCostUsd,
      totalInfraCapexUsd: results.totalInfraCapexUsd,
      estimatedLeadTimeMonths: results.estimatedLeadTimeMonths,
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
          Modelagem Técnico-Econômica & Dimensionamento Paramétrico
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Simulador de Viabilidade para Datacenter de IA
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Calcule a potência de entrada, CapEx elétrico (subestação + BESS), economia de autoprodução de energia e prazo de conexão para qualquer sítio nas Américas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (left 5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-700" />
              <span>Parâmetros de Entrada</span>
            </h3>
            <span className="text-xs text-slate-500">Modelo Matemático 2026</span>
          </div>

          {/* Region Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800">Região de Implantação</label>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none shadow-2xs"
            >
              {REGIONS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.flag} {r.name} ({r.country})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Tarifa Base: ${region.grid.averageIndustrialTariffUsdMwh}/MWh</span>
              <span>·</span>
              <span>Fila: {region.grid.interconnectionQueueMonths} meses</span>
            </div>
          </div>

          {/* IT Load Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Carga de TI de Servidores (IT Load)</span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums text-sm">
                {itLoadMw} MW
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={itLoadMw}
              onChange={(e) => setItLoadMw(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 MW (Cluster Médio)</span>
              <span>100 MW (Hyperscale)</span>
              <span>250 MW (Campus Gigawatt)</span>
            </div>
          </div>

          {/* Target PUE Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">PUE Projetado (Power Usage Effectiveness)</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                {targetPue.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.10"
              max="1.40"
              step="0.01"
              value={targetPue}
              onChange={(e) => setTargetPue(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.10 (Direct Liquid / Free Air)</span>
              <span>1.20 (Chiller Seco)</span>
              <span>1.40 (Legado Ar)</span>
            </div>
          </div>

          {/* Workload Profile */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800">Perfil de Carga de IA</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'training', label: 'Treino LLM', factor: '94% Fator Carga' },
                { id: 'inference', label: 'Inferência', factor: '78% Fator Carga' },
                { id: 'hybrid', label: 'Híbrido', factor: '88% Fator Carga' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWorkload(item.id as WorkloadType)}
                  className={`rounded-lg p-2 text-left border transition-colors cursor-pointer ${
                    workload === item.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.factor}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cooling Technology */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800">Tecnologia de Resfriamento</label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'direct_liquid', title: 'Direct-to-Chip Liquid Cooling (D2C)', desc: 'Zero consumo de água doce; placas frias nos processadores' },
                { id: 'closed_adiabatic', title: 'Chillers Adiabáticos Secos de Circuito Fechado', desc: 'Resfriamento a ar com micro-nebulização para picos' },
                { id: 'evaporative', title: 'Torres Evaporativas Convencionais', desc: 'Alto consumo hídrico (restrito em Querétaro/Santiago)' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    coolingTech === item.id
                      ? 'border-emerald-600 bg-emerald-50/60 text-slate-900 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="cooling"
                    checked={coolingTech === item.id}
                    onChange={() => setCoolingTech(item.id as any)}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Self-Generation Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">% Autoprodução Renovável (PPA Estruturado)</span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums text-sm">
                {renewableSelfGenPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={renewableSelfGenPercent}
              onChange={(e) => setRenewableSelfGenPercent(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {region.country === 'Brasil'
                ? 'Garante isenção de encargos CDE / PROINFA (Lei 9.074/95 e 14.120).'
                : 'PPA bilateral com certificados limpos dedicados.'}
            </div>
          </div>

          {/* BESS Hours */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800">Autonomia BESS (Armazenamento em Baterias)</label>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[0, 1, 2, 4].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setBessHours(hours)}
                  className={`rounded-lg py-2 border font-mono tabular-nums transition-colors cursor-pointer ${
                    bessHours === hours
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hours === 0 ? 'Sem BESS' : `${hours}h (${(results.totalFacilityPowerMw * hours).toFixed(0)} MWh)`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Economic Output Column (right 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Result KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <Zap className="h-3.5 w-3.5 text-emerald-700" />
                <span>Demanda Total na Subestação</span>
              </div>
              <div className="mt-1.5 text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {results.totalFacilityPowerMw}{' '}
                <span className="text-xs text-slate-500 font-normal">MW</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {itLoadMw} MW TI × {targetPue} PUE
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <DollarSign className="h-3.5 w-3.5 text-amber-700" />
                <span>Custo Anual de Energia</span>
              </div>
              <div className="mt-1.5 text-2xl font-bold font-mono text-amber-700 tabular-nums">
                ${(results.annualPowerCostUsd / 1_000_000).toFixed(1)}M
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Tarifa líquida: ${results.blendedTariff}/MWh
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-1 col-span-2 shadow-xs">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-cyan-700" />
                <span>Lead Time de Energização</span>
              </div>
              <div className="mt-1.5 text-2xl font-bold font-mono text-cyan-800 tabular-nums">
                {results.estimatedLeadTimeMonths}{' '}
                <span className="text-xs text-slate-500 font-normal">meses</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Subestação {region.grid.substationVoltageKv}
              </div>
            </div>
          </div>

          {/* CapEx Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Investimento Inicial Estimado em Infraestrutura Elétrica & Cooling
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Subestação dedicada, BESS de contingência e sistemas de rejeição térmica</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Total Infra CapEx</div>
                <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  ${(results.totalInfraCapexUsd / 1_000_000).toFixed(1)}M USD
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono tabular-nums">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-sans">
                  <span className="font-semibold text-slate-900">Subestação de Alta Tensão ({region.grid.substationVoltageKv})</span>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Transformadores de força, disjuntores SF6, switchgear e comissionamento
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  ${(results.substationCapexUsd / 1_000_000).toFixed(2)}M
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-sans">
                  <span className="font-semibold text-slate-900">Sistema BESS ({bessHours}h - {(results.totalFacilityPowerMw * bessHours).toFixed(0)} MWh)</span>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Baterias LFP, inversores grid-forming para absorção de transientes de GPU
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  ${(results.bessCapexUsd / 1_000_000).toFixed(2)}M
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-sans">
                  <span className="font-semibold text-slate-900">CDUs & Distribuição Liquid Cooling</span>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Coolant Distribution Units (CDU), bombas redundantes N+1 e trocadores de calor
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  ${(results.liquidCoolingCapexUsd / 1_000_000).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>

          {/* Environmental ESG & Emissions Avoided */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span>Emissões de CO2 Evitadas</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                {results.co2AvoidedTons.toLocaleString()} tCO2/ano
              </div>
              <p className="text-[11px] text-slate-500">
                Comparado com a matriz de referência fóssil (PJM/Dominion Energy)
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
              <div className="text-xs font-semibold text-cyan-800 flex items-center gap-1.5">
                <BatteryCharging className="h-4 w-4 text-cyan-600" />
                <span>Consumo Total Anual</span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                {results.annualEnergyConsumptionGwh.toLocaleString()} GWh/ano
              </div>
              <p className="text-[11px] text-slate-500">
                Equivalente ao consumo de uma cidade de médio porte
              </p>
            </div>
          </div>

          {/* AI Advisor Trigger Banner */}
          <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-slate-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Parecer Executivo Automatizado via Gemini 3.8 Flash</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Deseja auditar este cenário com inteligência artificial?
              </h4>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Nossa IA sintetiza os riscos regulatórios específicos de {region.country}, analisa a fila da concessionária e propõe estratégias de hedging de PPA.
              </p>
            </div>

            <button
              onClick={handleLaunchAi}
              className="flex items-center gap-2 shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-xs font-bold text-white transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <span>Gerar Parecer de IA</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
