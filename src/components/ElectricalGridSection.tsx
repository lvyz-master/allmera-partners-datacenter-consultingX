import React, { useState } from 'react';
import { REGIONS_DATA } from '../data/regionsData';
import { BatteryCharging } from 'lucide-react';
import gridSubstationImg from '../assets/images/grid_substation_infra_1791072813415.jpg';

export const ElectricalGridSection: React.FC = () => {
  const [metricSort, setMetricSort] = useState<'queue' | 'tariff' | 'renewable'>('queue');

  const sortedRegions = [...REGIONS_DATA].sort((a, b) => {
    if (metricSort === 'queue') {
      return a.grid.interconnectionQueueMonths - b.grid.interconnectionQueueMonths;
    }
    if (metricSort === 'tariff') {
      return a.grid.averageIndustrialTariffUsdMwh - b.grid.averageIndustrialTariffUsdMwh;
    }
    return b.grid.gridRenewablePercentage - a.grid.gridRenewablePercentage;
  });

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
          Engenharia de Potência & Interconexão de Alta Tensão
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Desafios Críticos de Infraestrutura Elétrica nas Américas
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          O consumo de energia de clusters de IA moderna não é linear nem suave: treinos massivos geram variações abruptas de carga (passos de sincronização de gradiente em paralelo) que desafiam os limites térmicos de transformadores e geram instabilidades de frequência na rede.
        </p>
      </div>

      {/* Hero Visual Card + Engineering Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BatteryCharging className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            Por que Clusters de IA Demandam Subestações e BESS Dedicados?
          </h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Ao contrário de cargas de nuvem comuns com fator de carga constante, os superclusters Blackwell e H100 operam com sincronização global de checkpoints: em frações de milissegundos, a demanda salta de <strong className="text-slate-900">20 MW</strong> para <strong className="text-slate-900">100 MW</strong>.
            </p>
            <p>
              Em mercados com redes frágeis ou subestações compartilhadas, essa variação rápida de potência ativa provoca quedas severas de tensão (<em className="text-amber-700">di/dt transients</em>).
            </p>
            <p>
              <strong className="text-emerald-800">Solução de Engenharia:</strong> A instalação de sistemas BESS (Battery Energy Storage Systems) de 2 a 4 horas com inversores 4-quadrantes com capacidade de <em className="text-slate-900 font-semibold">Grid-Forming</em> e transformadores com comutação de tapes sob carga (OLTC).
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 aspect-[16/10] shadow-sm bg-slate-900">
            <img
              src={gridSubstationImg}
              alt="Subestação de Alta Tensão 230kV e Contêineres de Bateria BESS"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-200">
              <span className="font-semibold text-white">Subestação 230kV + Banco BESS Modular</span>
              <span className="mx-2 text-slate-400">·</span>
              <span>Filtragem harmônica IEEE 519 para cargas de GPU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Data Grid with Sorting Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Quadro Comparativo de Interconexão Elétrica por Região
            </h3>
            <p className="text-xs text-slate-500">
              Dados auditados de operadores de sistema (ONS, CENACE, CNE, XM, PJM, ERCOT, Hydro-Québec)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs">
            <span className="text-slate-500 px-2 text-[11px] font-medium">Ordenar:</span>
            <button
              onClick={() => setMetricSort('queue')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                metricSort === 'queue' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fila de Subestação
            </button>
            <button
              onClick={() => setMetricSort('tariff')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                metricSort === 'tariff' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custo $/MWh
            </button>
            <button
              onClick={() => setMetricSort('renewable')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                metricSort === 'renewable' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              % Renovável
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Polo / Jurisdição</th>
                <th className="py-3.5 px-4 text-right">Fila de Conexão</th>
                <th className="py-3.5 px-4 text-right">Capacidade Disp.</th>
                <th className="py-3.5 px-4 text-right">Tarifa Industrial</th>
                <th className="py-3.5 px-4 text-right">Matriz Limpa</th>
                <th className="py-3.5 px-4 text-center">Risco de Curtailment</th>
                <th className="py-3.5 px-4">Papel do BESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono tabular-nums">
              {sortedRegions.map((region) => (
                <tr key={region.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-900 flex items-center gap-2">
                    <span className="text-base">{region.flag}</span>
                    <div>
                      <div className="text-xs font-semibold">{region.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{region.grid.substationVoltageKv}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold ${
                        region.grid.interconnectionQueueMonths <= 24
                          ? 'text-emerald-700'
                          : region.grid.interconnectionQueueMonths <= 36
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {region.grid.interconnectionQueueMonths} meses
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                    {region.grid.availableCapacityMw} MW
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ${region.grid.averageIndustrialTariffUsdMwh}/MWh
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        region.grid.gridRenewablePercentage >= 80
                          ? 'text-emerald-700'
                          : region.grid.gridRenewablePercentage >= 50
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {region.grid.gridRenewablePercentage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-sans text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        region.grid.curtailmentRisk === 'Baixo'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : region.grid.curtailmentRisk === 'Médio'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {region.grid.curtailmentRisk}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">{region.grid.bessNecessity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid Architecture Blueprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Desafio 1 · O Congestionamento de Linhas
          </div>
          <h4 className="text-base font-bold text-slate-900">Saturação de Linhas de 500kV</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            No Brasil e no Chile, a maior parte da geração renovável (solar no Atacama e Nordeste brasileiro) fica a mais de 1.500 km dos centros de carga. Desenvolvedores de data centers que buscam conexão no Sudeste enfrentam restrições do ONS para despacho garantido.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
            Desafio 2 · Tempo de Espera por Transformadores
          </div>
          <h4 className="text-base font-bold text-slate-900">Lead Time de Equipamentos de Alta Tensão</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            O lead time global para grandes transformadores de subestação (GSU de 230kV / 500kV) subiu para 100 a 140 semanas globalmente. Desenvolvedores bem-sucedidos em mercados emergentes compram os transformadores antes de obter a outorga final da concessionária.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Desafio 3 · Estabilidade e Fator de Potência
          </div>
          <h4 className="text-base font-bold text-slate-900">Filtros Harmônicos e Cargas Não-Lineares</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fontes de alimentação comutadas de servidores de IA geram alta distorção harmônica total (THD). Subestações de data center necessitam de bancos de capacitores chaveados e compensadores estáticos de reativos (STATCOM) para atender às exigências de rede.
          </p>
        </div>
      </div>
    </div>
  );
};
