import React, { useState } from 'react';
import { REGULATORY_COMPENDIUM } from '../data/regulatoryPolicies';
import { ShieldCheck, Droplets, SunMedium, FileText, CheckCircle, Scale, AlertCircle } from 'lucide-react';
import renewableMatrixImg from '../assets/images/renewable_power_matrix_1791072823621.jpg';

export const RegulatoryFrameworkSection: React.FC = () => {
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
  const selectedPolicy = REGULATORY_COMPENDIUM[selectedCountryIndex];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
          Marco Legal, ESG & Sustentabilidade Operacional
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Políticas Regulatórias de Energia Renovável & Diretrizes Ambientais
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Garantir sustentabilidade operacional para um datacenter de IA de 100 MW exige dominar a arquitetura de contratos de compra de energia (PPAs), regimes tributários de autoprodução e compliance com restrições hídricas severas nas Américas.
        </p>
      </div>

      {/* Visual Banner + Renewable Generation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <SunMedium className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            A Transição de "Net Zero Anual" para "24/7 Carbon-Free Energy"
          </h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Hiperescalas globais (Google, Microsoft, AWS) alteraram suas diretrizes de sustentabilidade: a simples compra de certificados I-REC anuais já não é aceita como métrica de ponta.
            </p>
            <p>
              O novo padrão é o <strong className="text-slate-900">24/7 CFE (Carbon-Free Energy) hora a hora</strong>: cada megawatt-hora consumido pelo cluster de IA às 3h da madrugada deve ser gerado por uma fonte limpa em tempo real no mesmo subsistema elétrico.
            </p>
            <p>
              <strong className="text-emerald-800">Vantagem Competitiva da LATAM:</strong> O Brasil e o Canadá (Quebec) possuem as maiores matrizes hidrelétricas com reservatórios de acumulação do mundo, funcionando como baterias virtuais gigantes que garantem 24/7 CFE sem emissões de carbono fóssil, mesmo sem sol ou vento.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 aspect-[16/10] shadow-sm bg-slate-900">
            <img
              src={renewableMatrixImg}
              alt="Parque Híbrido de Geração Solar Fotovoltaica e Turbinas Eólicas"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-200">
              <span className="font-semibold text-white">Parque Híbrido Solar & Eólico Dedicado</span>
              <span className="mx-2 text-slate-400">·</span>
              <span>PPA Bilateral Estruturado com Rastreabilidade I-REC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Compendium Interactive Explorer */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Dossiê Regulatório Comparativo por Jurisdição
            </h3>
            <p className="text-xs text-slate-500">
              Selecione o país para verificar regras de PPA, autoprodução, encargos setoriais e licenciamento de resfriamento.
            </p>
          </div>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {REGULATORY_COMPENDIUM.map((policy, idx) => (
            <button
              key={policy.country}
              onClick={() => setSelectedCountryIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCountryIndex === idx
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>{policy.flag}</span>
              <span>{policy.country}</span>
            </button>
          ))}
        </div>

        {/* Selected Country Regulatory Deep Dive Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedPolicy.flag}</span>
              <div>
                <h4 className="font-display text-lg font-bold text-slate-900">
                  Marco Regulatório Energético: {selectedPolicy.country}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Órgãos Reguladores Centrais: <strong className="text-slate-800">{selectedPolicy.keyRegulatoryBody}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 font-semibold">
              Viabilidade 24/7 CFE: {selectedPolicy.twentyFourSevenReadiness}
            </div>
          </div>

          {/* Grid of Regulatory Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-700" />
                <span>Estrutura de Contratação (PPA & Mercado Livre)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedPolicy.ppaModel}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-700" />
                <span>Regime de Autoprodução de Energia</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedPolicy.selfGenerationLaw}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-700" />
                <span>Isenções de Encargos Setoriais & Descontos de Rede</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedPolicy.gridChargesExemption}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-amber-700" />
                <span>Restrições Hídricas & Diretrizes de Refrigeração</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedPolicy.waterAndCoolingMandates}</p>
            </div>
          </div>

          {/* Strategic Takeaway Highlight Box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Conclusão Estratégica & Recomendação para Desenvolvedores</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              {selectedPolicy.strategicTakeaway}
            </p>
          </div>
        </div>
      </div>

      {/* The Water Crisis Case Study: PUE vs. WUE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>O Dilema Crítico de Sustentabilidade: PUE vs. WUE</span>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
            Por que Torres Evaporativas Estão Sendo Banidas em Querétaro e Santiago
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">1. O Consumo Oculto de Água</h4>
            <p>
              Para alcançar um baixo índice de PUE (1.15 a 1.20) com chillers convencionais em climas quentes, utiliza-se resfriamento evaporativo, que consome em média <strong className="text-slate-900">1,8 litro de água potável por kWh de TI</strong>.
            </p>
            <p>
              Em um campus de IA de 100 MW a plena carga, isso resulta em um consumo de <strong className="text-amber-700">4,3 milhões de litros de água por dia</strong> — volume equivalente ao abastecimento de uma cidade de 35.000 habitantes.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">2. A Reação Regulatória e Social</h4>
            <p>
              Em Querétaro (México) e na bacia de Maipo/Santiago (Chile), que enfrentam secas históricas, comunidades locais e tribunais ambientais cancelaram ou suspenderam licenças de grandes operadores.
            </p>
            <p>
              O governo de Querétaro e a CONAGUA proibiram formalmente a perfuração de novos poços subterrâneos para arrefecimento de data centers.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">3. A Solução: Direct-to-Chip 100% Seco</h4>
            <p>
              A engenharia de ponta para IA de 2026 adotou o <strong className="text-emerald-700">Direct-to-Chip (D2C) Liquid Cooling</strong> de circuito fechado com placas frias nos processadores gráficos.
            </p>
            <p>
              O calor do líquido primário é rejeitado para o ambiente externo através de <strong className="text-slate-900">Dry Coolers adiabáticos</strong> que só usam micro-nebulização em picos extremos de calor, reduzindo o WUE para próximo de <strong className="text-emerald-700">0,05 L/kWh</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
