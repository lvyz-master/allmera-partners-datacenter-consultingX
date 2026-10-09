import React from 'react';
import { Globe, Radio, Cpu } from 'lucide-react';

export const LatencyMatrixSection: React.FC = () => {
  // Benchmark latency matrix data (Round-trip time in milliseconds)
  const latencyTable = [
    { origin: 'São Paulo (Brasil)', toAshburn: 118, toMiami: 104, toSaoPaulo: 2, toQueretaro: 122, toSantiago: 38, subseaSystem: 'Monet, Seabras-1, Firmina' },
    { origin: 'Fortaleza (Brasil)', toAshburn: 79, toMiami: 65, toSaoPaulo: 32, toQueretaro: 95, toSantiago: 68, subseaSystem: 'EllaLink, Monet, SACS, Seabras-1' },
    { origin: 'Querétaro (México)', toAshburn: 48, toMiami: 42, toSaoPaulo: 122, toQueretaro: 2, toSantiago: 118, subseaSystem: 'Terrestrial Cross-Border (Laredo/McAllen)' },
    { origin: 'Santiago (Chile)', toAshburn: 128, toMiami: 92, toSaoPaulo: 38, toQueretaro: 118, toSantiago: 1, subseaSystem: 'Curie, Firmina, SAC' },
    { origin: 'Bogotá (Colômbia)', toAshburn: 56, toMiami: 44, toSaoPaulo: 98, toQueretaro: 58, toSantiago: 82, subseaSystem: 'Maya-1, ARCOS, CFX-1' },
    { origin: 'Panamá (PTY)', toAshburn: 52, toMiami: 38, toSaoPaulo: 82, toQueretaro: 52, toSantiago: 76, subseaSystem: '7 Cabos Bioceânicos (PAC, ARCOS)' },
    { origin: 'Texas ERCOT (EUA)', toAshburn: 26, toMiami: 24, toSaoPaulo: 116, toQueretaro: 24, toSantiago: 120, subseaSystem: 'Backbone Terrestre US' },
    { origin: 'Quebec (Canadá)', toAshburn: 16, toMiami: 38, toSaoPaulo: 130, toQueretaro: 64, toSantiago: 135, subseaSystem: 'Backbone Terrestre Canadá/EUA' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
          Telecomunicações, Cabos Submarinos & RTT
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          A Geografia da Latência: Onde Treinar e Onde Inferir
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          A topologia de rede define o modelo de negócios de um datacenter de IA. Compreenda como a velocidade da luz em fibra óptica (cerca de 5 µs por km) e os novos cabos submarinos (Firmina, Monet, Curie) remodelaram o mapa de atratividade da América Latina.
        </p>
      </div>

      {/* Visual Image & Subsea Cable Landing Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 aspect-[16/10] shadow-sm">
            <img
              src="/src/assets/images/subsea_fiber_landing_1791072832841.jpg"
              alt="Subsea fiber optic cable landing station at coastal horizon"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-200">
              <span className="font-semibold text-white">Estação de Cabos Submarinos (Cable Landing Station)</span>
              <span className="mx-2 text-slate-400">·</span>
              <span>Conexão de Alta Capacidade com Amplificação Óptica DWDM</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            Cabos Submarinos de Nova Geração: O Salto de Capacidade
          </h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Historicamente, a América do Sul dependia de rotas submarinas com latências elevadas e pouca redundância. Entre 2020 e 2026, cabos de hiperescala direta entraram em operação:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">· Firmina (Google):</span>
                <span>O mais longo cabo com capacidade de alimentação de energia por extremidade única, conectando EUA (Myrtle Beach), Brasil (Santos/Rio), Uruguai e Argentina.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">· Curie (Google):</span>
                <span>Primeiro cabo privado conectando a Califórnia diretamente a Valparaíso (Chile), contornando os atrasos terrestres andinos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">· EllaLink:</span>
                <span>Conexão direta pioneira entre Fortaleza (Brasil) e Sines (Portugal), com RTT de apenas 58ms, eliminando a dependência do trânsito pelos EUA para tráfego europeu.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Latency Matrix Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Matriz de Latência Inter-Regional (RTT Médio em Milissegundos)
            </h3>
            <p className="text-xs text-slate-500">
              Valores de Round-Trip Time medidos entre os maiores Pontos de Troca de Tráfego (IXs)
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>&lt;25ms (Inferência Imediata)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-600 inline-block" />
              <span>25-60ms (Inferência Tolerável)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-600 inline-block" />
              <span>&gt;60ms (Treinamento / Batch)</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Origem</th>
                <th className="py-3.5 px-4 text-center">Ashburn VA</th>
                <th className="py-3.5 px-4 text-center">Miami NAP</th>
                <th className="py-3.5 px-4 text-center">São Paulo IX.br</th>
                <th className="py-3.5 px-4 text-center">Querétaro</th>
                <th className="py-3.5 px-4 text-center">Santiago</th>
                <th className="py-3.5 px-4">Principais Sistemas Submarinos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono tabular-nums">
              {latencyTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    {row.origin}
                  </td>

                  {[row.toAshburn, row.toMiami, row.toSaoPaulo, row.toQueretaro, row.toSantiago].map((ms, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-xs ${
                          ms <= 25
                            ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                            : ms <= 60
                            ? 'text-cyan-800 bg-cyan-50 border border-cyan-200'
                            : 'text-amber-800 bg-amber-50 border border-amber-200'
                        }`}
                      >
                        {ms} ms
                      </span>
                    </td>
                  ))}

                  <td className="py-3 px-4 font-sans text-xs text-slate-500">
                    {row.subseaSystem}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Crucial Architectural Distinction: Training vs. Inference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Cpu className="h-5 w-5 text-emerald-600" />
            <span>Perfil A: Treinamento de Modelos de Fundação (LLMs)</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Por que Mercados Emergentes de Baixo Custo Elétrico Vencem
          </h4>
          <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <p>
              Em um cluster de treino (ex: 24.000 GPUs H100 ou B200), mais de 99% das trocas de dados ocorrem dentro do próprio datacenter entre placas aceleradoras adjacentes via barramento <strong className="text-slate-900">NVLink (900 GB/s)</strong> ou rede InfiniBand Quantum-2 a menos de <strong className="text-slate-900">2 microssegundos</strong>.
            </p>
            <p>
              A comunicação com a internet externa é restrita ao download inicial de datasets (pre-training tokens) e upload periódico de checkpoints (a cada 2-4 horas).
            </p>
            <div className="rounded-lg bg-emerald-50/70 p-3 border border-emerald-200 text-emerald-900">
              <strong>Veredito Estratégico:</strong> Para treino, latência externa de 50ms a 90ms é irrelevante. O que dita a viabilidade é <strong className="text-slate-900">energia ultrabarata (&lt;$50/MWh)</strong>, <strong className="text-slate-900">100% renovável</strong> e <strong className="text-slate-900">disponibilidade rápida de MWs</strong> (Ceará, Patagônia, Atacama, Quebec, Texas).
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
            <Radio className="h-5 w-5 text-cyan-600" />
            <span>Perfil B: Inferência em Tempo Real & Agentes Autônomos</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Por que a Proximidade dos Centros Econômicos é Inegociável
          </h4>
          <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <p>
              Na inferência, o usuário final ou sistema empresarial envia uma consulta e aguarda os tokens gerados em streaming. Cada milissegundo de RTT adicional degrada o <strong className="text-slate-900">Time to First Token (TTFT)</strong> e a experiência de voz interativa.
            </p>
            <p>
              Setores como bancos, saúde, comércio eletrônico e agentes de atendimento exigem SLAs de latência menores que 20ms para os backbones locais.
            </p>
            <div className="rounded-lg bg-cyan-50/70 p-3 border border-cyan-200 text-cyan-900">
              <strong>Veredito Estratégico:</strong> Clusters de inferência devem ser implantados próximos aos grandes centros urbanos e pontos de troca de tráfego consolidados (<strong className="text-slate-900">São Paulo SP1-SP4</strong>, <strong className="text-slate-900">Querétaro</strong>, <strong className="text-slate-900">Santiago</strong>, <strong className="text-slate-900">Ashburn</strong>, <strong className="text-slate-900">Dallas</strong>).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
