import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Layers,
  Thermometer,
  Cpu,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { BessSizingResult, BessVendorProduct } from '../types/bess';

interface BessSingleLineDiagramProps {
  sizing: BessSizingResult;
  vendor: BessVendorProduct;
  connectionVoltage: string;
  hasSolarPv: boolean;
}

export const BessSingleLineDiagram: React.FC<BessSingleLineDiagramProps> = ({
  sizing,
  vendor,
  connectionVoltage,
  hasSolarPv,
}) => {
  const [activeComponent, setActiveComponent] = useState<string | null>('bess_container');

  const componentDetails: Record<string, { title: string; subtitle: string; description: string; specs: string[] }> = {
    grid_connection: {
      title: 'Ponto de Conexão à Rede (PDC / Subestação Concessionária)',
      subtitle: `Tensão de Fornecimento: ${connectionVoltage || '13.8 kV'} • Grupo A`,
      description: 'Ponto de acoplamento comum (PAC) com disjuntor geral de MT, transformadores de potencial (TP) e corrente (TC) para medição de faturamento CCEE / Distribuidora, e relé de proteção multifunção (ANSI 50/51, 27/59, 81O/U, 67, 32).',
      specs: [
        `Tensão de Interconexão: ${connectionVoltage || '13.8 kV'} trifásica`,
        'Medição de Faturamento: Classe 0.2s homologada CCEE/Distribuidora',
        'Relé de Proteção: SEL-751 ou similar com ilhamento anti-ilhotamento passivo/ativo',
        'Disjuntor a Vácuo / SF6 motorizado com religamento supervisionado',
      ],
    },
    transformer_skid: {
      title: `Skid de Transformador Elevador MT (${sizing.transformerRatingMva} MVA)`,
      subtitle: `${sizing.mvTransformerSkidCount}x Transformador Elevador BT/MT com Proteção Integrada`,
      description: 'Transformador elevador imerso em óleo vegetal biodegradável (Éster natural) com ponto de fulgor elevado (>300°C), acoplado diretamente à saída dos inversores PCS em baixa tensão (0.69 kV / 0.8 kV) elevando para a média tensão da planta.',
      specs: [
        `Potência Total do Skid: ${sizing.transformerRatingMva} MVA`,
        'Primário/Secundário: 13.8 kV (ou 34.5 kV) / 0.8 kV - Ligação Dyn1',
        'Fluido Dielétrico: Óleo vegetal biodegradável classe K (FR3)',
        'Acessórios: Válvula de alívio de pressão, relé de gás Buchholz e termômetro de enrolamento',
      ],
    },
    pcs_inverters: {
      title: `Sistema de Conversão de Potência - PCS (${sizing.pcsInverterCount}x Unidades)`,
      subtitle: `Arquitetura ${vendor.architectureType} • ${sizing.nominalPowerMw} MW Total`,
      description: 'Inversores bidirecionais de 4 quadrantes para controle independente de potência ativa (P) e reativa (Q), suporte a formação de rede (Grid-Forming / Black-start) e tempo de resposta a degrau inferior a 20 ms.',
      specs: [
        `Potência Nominal Total: ${sizing.nominalPowerKw.toLocaleString('pt-BR')} kW (${sizing.nominalPowerMw} MW)`,
        `Quantidade de Módulos: ${sizing.pcsInverterCount}x inversores (${sizing.pcsUnitRatingKw} kW cada)`,
        'Funções Grid-Forming: Modo ilhado com controle V/f e amortecimento virtual',
        `Eficiência do Conversor: > 98.8% com transistores SiC / IGBT de última geração`,
      ],
    },
    bess_container: {
      title: `Contêineres de Bateria BESS (${sizing.batteryContainersCount}x Unidades)`,
      subtitle: `${vendor.productLine} • ${sizing.nominalEnergyMwh} MWh (${sizing.usableEnergyMwh} MWh Útil)`,
      description: `Contêiner industrial padronizado com certificação UL 9540A e NFPA 855. Equipado com células de LFP (Fosfato de Ferro-Lítio), ${vendor.coolingMethod} para homogeneidade térmica (< 2.5°C entre células) e sistema de supressão por agente limpo FK-5-1-12.`,
      specs: [
        `Capacidade Nominal Total: ${sizing.nominalEnergyMwh} MWh (${sizing.nominalEnergyKwh.toLocaleString('pt-BR')} kWh)`,
        `Capacidade Útil (90% DoD): ${sizing.usableEnergyMwh} MWh`,
        `Taxa C-Rate: ${sizing.cRate}C (${(1 / sizing.cRate).toFixed(1)}h de autonomia contínua)`,
        `Química das Células: LFP (LiFePO4) Prismática 314Ah / Blade`,
        `Sistema Térmico: ${vendor.coolingMethod} com chiller de alta eficiência`,
        'Segurança: Sistema de detecção de off-gas pré-combustão e ventilação de deflagração',
      ],
    },
    pv_solar: {
      title: 'Usinas Solares Fotovoltaicas (Hibridização)',
      subtitle: 'Arranjos Fotovoltaicos com Inversores de String / Central',
      description: 'Geração solar interligada no mesmo barramento de média ou baixa tensão, permitindo mitigação direta de corte de geração (curtailment) e injeção sincronizada de energia limpa com ramp-rate suave.',
      specs: [
        'Acoplamento: AC Coupling em 0.8 kV ou 13.8 kV',
        'Controle de Rampa: Suavização automática de intermitência solar por nuvens',
        'Curtailment Management: Absorção instantânea de excedente antes do PAC',
      ],
    },
    critical_load: {
      title: 'Barramento de Cargas Críticas & Quadro de Transferência (QTA)',
      subtitle: 'Transição Ininterrupta de Ilhamento (< 20ms)',
      description: 'Quadro elétrico inteligente que isola as cargas críticas da planta em caso de colapso da rede da distribuidora, garantindo que o BESS mantenha os servidores, motores ou processos vitais em funcionamento contínuo.',
      specs: [
        'Tempo de Chaveamento para Ilha: < 20 milissegundos (Classe UPS)',
        'Controle de Estabilidade de Tensão e Frequência em Modo Ilhado',
        'Priorização Dinâmica de Cargas por Contatores Supervisionados',
      ],
    },
  };

  const currentInfo = activeComponent ? componentDetails[activeComponent] : componentDetails['bess_container'];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            Engenharia de Conexão & Arquitetura de Potência
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
            Diagrama Unifilar Interativo (SLD) do Sistema BESS
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Padrão de interconexão em média tensão com {vendor.vendorName} ({vendor.productLine}). Clique nos componentes para inspecionar os detalhes técnicos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Em Operação Sincronizada
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative overflow-x-auto rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 text-white shadow-inner">
        <div className="min-w-[820px] max-w-[1000px] mx-auto">
          <svg viewBox="0 0 950 440" className="w-full h-auto select-none font-sans">
            <defs>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="bessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="pcsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="trafoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Power Bus Line (13.8kV MT) */}
            <line x1="80" y1="90" x2="870" y2="90" stroke="#38bdf8" strokeWidth="4" strokeDasharray="none" />
            <text x="475" y="75" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
              BARRAMENTO DE MÉDIA TENSÃO DA PLANTA ({connectionVoltage || '13.8 kV'})
            </text>

            {/* Flow arrows */}
            <path d="M 400 90 L 415 85 L 415 95 Z" fill="#38bdf8" opacity="0.8" />
            <path d="M 550 90 L 565 85 L 565 95 Z" fill="#38bdf8" opacity="0.8" />

            {/* BLOCK 1: Rede Concessionária (Utility Grid) */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('grid_connection')}
            >
              <rect
                x="60"
                y="140"
                width="160"
                height="110"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'grid_connection' ? '#38bdf8' : '#334155'}
                strokeWidth={activeComponent === 'grid_connection' ? '3' : '1.5'}
                filter={activeComponent === 'grid_connection' ? 'url(#glow)' : undefined}
              />
              <line x1="140" y1="90" x2="140" y2="140" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="140" cy="90" r="5" fill="#38bdf8" />
              
              <rect x="125" y="105" width="30" height="20" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <text x="140" y="119" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">52-G</text>

              <text x="140" y="170" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">Rede Concessionária</text>
              <text x="140" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">Ponto de Conexão (PAC)</text>
              <text x="140" y="210" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">{connectionVoltage || '13.8 kV'} • Medição CCEE</text>
              <text x="140" y="235" fill="#64748b" fontSize="9" textAnchor="middle">Proteção ANSI 50/51/27/59</text>
            </g>

            {/* BLOCK 2: Trafo Elevador MT (Center-left) */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('transformer_skid')}
            >
              <line x1="430" y1="90" x2="430" y2="160" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="430" cy="90" r="5" fill="#f59e0b" />
              
              <rect
                x="350"
                y="160"
                width="160"
                height="100"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'transformer_skid' ? '#f59e0b' : '#334155'}
                strokeWidth={activeComponent === 'transformer_skid' ? '3' : '1.5'}
                filter={activeComponent === 'transformer_skid' ? 'url(#glow)' : undefined}
              />

              {/* Trafo Symbol (Interlocking circles) */}
              <circle cx="418" cy="195" r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="442" cy="195" r="14" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

              <text x="430" y="225" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Trafo Elevador MT</text>
              <text x="430" y="243" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                {sizing.mvTransformerSkidCount}x {sizing.transformerRatingMva} MVA • 13.8/0.8kV
              </text>
            </g>

            {/* Low Voltage AC bus (0.8kV) */}
            <line x1="330" y1="285" x2="710" y2="285" stroke="#6366f1" strokeWidth="3" strokeDasharray="4 2" />
            <text x="520" y="278" fill="#818cf8" fontSize="9" fontWeight="bold" textAnchor="middle">
              BARRAMENTO BT INTERNO (0.8 kV AC)
            </text>

            <line x1="430" y1="260" x2="430" y2="285" stroke="#f59e0b" strokeWidth="2.5" />

            {/* BLOCK 3: PCS Inverters */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('pcs_inverters')}
            >
              <line x1="520" y1="285" x2="520" y2="315" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="520" cy="285" r="4" fill="#6366f1" />

              <rect
                x="440"
                y="315"
                width="160"
                height="95"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'pcs_inverters' ? '#6366f1' : '#334155'}
                strokeWidth={activeComponent === 'pcs_inverters' ? '3' : '1.5'}
                filter={activeComponent === 'pcs_inverters' ? 'url(#glow)' : undefined}
              />

              {/* Inverter Symbol AC/DC */}
              <rect x="500" y="325" width="40" height="22" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <path d="M 508 340 L 518 330 M 522 340 ~ 532 330" stroke="#818cf8" strokeWidth="1.5" />
              <text x="510" y="336" fill="#818cf8" fontSize="8" fontWeight="bold">DC</text>
              <text x="526" y="342" fill="#818cf8" fontSize="8" fontWeight="bold">AC</text>

              <text x="520" y="365" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Inversores PCS</text>
              <text x="520" y="382" fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {sizing.pcsInverterCount}x {sizing.pcsUnitRatingKw} kW ({sizing.nominalPowerMw} MW)
              </text>
              <text x="520" y="398" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                Bidirecional 4Q • Grid-Forming
              </text>
            </g>

            {/* DC Bus */}
            <line x1="600" y1="365" x2="650" y2="365" stroke="#10b981" strokeWidth="3" />
            <text x="625" y="358" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">1500V DC</text>

            {/* BLOCK 4: Battery Container (BESS) */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('bess_container')}
            >
              <rect
                x="650"
                y="315"
                width="240"
                height="105"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'bess_container' ? '#10b981' : '#334155'}
                strokeWidth={activeComponent === 'bess_container' ? '3.5' : '1.5'}
                filter={activeComponent === 'bess_container' ? 'url(#glow)' : undefined}
              />

              {/* Badge on container */}
              <rect x="660" y="325" width="95" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <text x="707" y="337" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                LFP • {vendor.coolingMethod.split(' ')[0]}
              </text>

              <text x="770" y="355" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">
                BESS Contêineres
              </text>
              <text x="770" y="375" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">
                {sizing.batteryContainersCount}x Contêiner • {sizing.nominalEnergyMwh} MWh ({sizing.cRate}C)
              </text>
              <text x="770" y="395" fill="#94a3b8" fontSize="9" textAnchor="middle">
                {vendor.vendorName} ({vendor.productLine.split('(')[0]})
              </text>
              <text x="770" y="410" fill="#64748b" fontSize="8" textAnchor="middle">
                FK-5-1-12 • UL 9540A • NFPA 855
              </text>
            </g>

            {/* BLOCK 5: Solar PV (Right-top, optional / simulated) */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('pv_solar')}
            >
              <line x1="710" y1="90" x2="710" y2="140" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="710" cy="90" r="5" fill="#f59e0b" />

              <rect
                x="640"
                y="140"
                width="140"
                height="90"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'pv_solar' ? '#f59e0b' : '#334155'}
                strokeWidth={activeComponent === 'pv_solar' ? '3' : '1.5'}
              />

              <text x="710" y="168" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                {hasSolarPv ? 'Geração Solar FV' : 'Acoplamento Solar'}
              </text>
              <text x="710" y="188" fill="#f59e0b" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                {hasSolarPv ? 'UFV Híbrida / FTM' : 'Opcional / Hibridação'}
              </text>
              <text x="710" y="208" fill="#94a3b8" fontSize="8" textAnchor="middle">
                Mitigação Curtailment
              </text>
            </g>

            {/* BLOCK 6: Critical Loads / Facility (Far right) */}
            <g
              className="cursor-pointer transition-all hover:opacity-90"
              onClick={() => setActiveComponent('critical_load')}
            >
              <line x1="840" y1="90" x2="840" y2="140" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="840" cy="90" r="5" fill="#38bdf8" />

              <rect
                x="795"
                y="140"
                width="135"
                height="90"
                rx="10"
                fill="#0f172a"
                stroke={activeComponent === 'critical_load' ? '#38bdf8' : '#334155'}
                strokeWidth={activeComponent === 'critical_load' ? '3' : '1.5'}
              />

              <text x="862" y="168" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                Cargas Críticas
              </text>
              <text x="862" y="188" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                QTA Ilhamento &lt;20ms
              </text>
              <text x="862" y="208" fill="#94a3b8" fontSize="8" textAnchor="middle">
                Data Center / Indústria
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Component Details Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-sm">
              Especificação de Engenharia de Detalhe
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {currentInfo.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {currentInfo.subtitle}
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shrink-0">
            Fornecedor Selecionado: <strong className="text-slate-800">{vendor.vendorName}</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
          {currentInfo.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2">
            Parâmetros & Critérios de Projeto:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentInfo.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-slate-200/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
