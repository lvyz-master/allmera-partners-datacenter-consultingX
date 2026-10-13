import React from 'react';
import {
  Server,
  BatteryCharging,
  Zap,
  Globe,
  Cpu,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Layers,
  BarChart3,
  Scale,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { AllmeraLogo } from './AllmeraLogo';

interface ConsultingHubProps {
  onSelectPortal: (portal: 'datacenter' | 'bess') => void;
  currentUser: string;
  onLogout: () => void;
}

export const ConsultingHub: React.FC<ConsultingHubProps> = ({
  onSelectPortal,
  currentUser,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Background delicate ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-emerald-500/[0.035] blur-[140px]" />
        <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-blue-500/[0.03] blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AllmeraLogo size="md" subtitle="Consulting Group" />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Sessão Ativa: {currentUser}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Encerrar sessão"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Selection Body */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col justify-center">
        {/* Hero Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Plataforma Corporativa de Inteligência Energética & Infraestrutura
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight">
            Selecione a Linha de Consultoria
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Escolha o ambiente de trabalho desejado para acessar os modelos de engenharia, estudos comparativos de TCO e relatórios executivos especializados da Allmera Partners.
          </p>
        </div>

        {/* 2 Main Choice Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Option 1: DataCentre Consulting */}
          <div className="group relative rounded-3xl border-2 border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm hover:shadow-xl hover:border-emerald-500/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent rounded-bl-3xl pointer-events-none" />
            
            <div className="space-y-6">
              {/* Badge & Top Meta */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase">
                  Módulo 01
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <Globe className="h-3 w-3" />
                  Américas Hyperscale
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <Server className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 group-hover:text-emerald-700 transition-colors">
                    DataCentre Consulting
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Infraestrutura Crítica, Matriz Elétrica & Latência nas Américas
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Plataforma analítica e executiva para implantação de Data Centers de Inteligência Artificial e Nuvem nas Américas. Análise de subestações de alta tensão, rotas de cabos submarinos, marcos regulatórios de PPAs e modelagem de Capex/Opex de fornecedores.
              </p>

              {/* Key Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recursos Inclusos na Plataforma:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Estudo Comercial TCO & Fornecedores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Mapa Continental Interativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Polos Regionais (SP, RJ, CE, Querétaro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Simulador de Viabilidade & PUE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Conexão ao SIN & Subestações ONS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Matriz de Latência & Cabos Submarinos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={() => onSelectPortal('datacenter')}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white py-3.5 px-6 font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:bg-emerald-700"
              >
                <span>Acessar DataCentre Consulting</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Option 2: BESS Consulting */}
          <div className="group relative rounded-3xl border-2 border-emerald-500/80 bg-white p-7 sm:p-9 shadow-lg shadow-emerald-500/5 hover:shadow-2xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between overflow-hidden ring-4 ring-emerald-500/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-600/15 via-transparent to-transparent rounded-bl-3xl pointer-events-none" />
            
            <div className="space-y-6">
              {/* Badge & Top Meta */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 text-white px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-xs">
                  Módulo 02 • Engenharia BESS
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full">
                  <Zap className="h-3 w-3 text-emerald-700" />
                  Mercado Brasileiro
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                  <BatteryCharging className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 group-hover:text-emerald-700 transition-colors">
                    BESS Consulting
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Engenharia de Aplicação, Dimensionamento & Dossiê Executivo
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Módulo completo de dimensionamento técnico-operacional de Sistemas de Armazenamento de Energia por Baterias (BESS) no Brasil. Avaliação do Cardápio de Aplicações, comparativo detalhado com soluções disponíveis no Brasil (Huawei, Sungrow, BYD, WEG, Tesla) e exportação de Dossiê Executivo em PDF.
              </p>

              {/* Key Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Cardápio BESS & Entregáveis:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Cardápio de Serviços (Ponta, Arbitragem, Backup)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Dimensionamento de Potência (MW) & Energia (MWh)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Comparativo Brasil: Huawei, Sungrow, BYD, WEG, Tesla</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Geração de Dossiê Completo Exportável em PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Viabilidade Financeira (Payback, TIR, VPL, LCOS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Enquadramento Tarifário Grupo A (Verde / Azul)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-8">
              <button
                onClick={() => onSelectPortal('bess')}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3.5 px-6 font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Acessar ao BESS Consulting</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Corporate Trust Strip */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-slate-200/80 bg-white/70 p-4 sm:p-6 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Padrão de Conformidade Regulatória Brasileira & Internacional</p>
              <p className="text-[11px] text-slate-500">
                Resoluções Aneel 1.000/2021, Procedimentos de Rede ONS, Normas ABNT NBR e Certificações NFPA 855 / UL 9540A.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Allmera Advisory v4.2</span>
            <span>•</span>
            <span>São Paulo / Brasil</span>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-slate-200/60 py-4 px-4 sm:px-8 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Allmera Partners. Todos os direitos reservados. Confidencial e exclusivo para clientes corporativos.
      </footer>
    </div>
  );
};
