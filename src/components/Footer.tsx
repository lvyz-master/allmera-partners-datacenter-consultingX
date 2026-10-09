import React from 'react';
import { AllmeraLogo } from './AllmeraLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-20 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <AllmeraLogo size="sm" />
            <p className="text-slate-500 text-xs leading-relaxed">
              <strong>Allmera Partners Data Center Consulting</strong> — inteligência estratégica, modelagem de TCO e consultoria de infraestrutura de alta densidade e rede elétrica nas Américas.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Fontes Regulatórias Elétricas
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>Brasil: ONS, CCEE, ANEEL (Leis 9.074/95 e 14.120)</li>
              <li>México: CENACE, CRE, CFE (Lei da Indústria Elétrica)</li>
              <li>Chile: Coordinador Eléctrico Nacional, CNE, SEC</li>
              <li>Colômbia: XM, CREG, UPME (Lei 1715)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Normas Técnicas de Engenharia
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>IEEE 519-2022: Controle Harmônico em Redes Industriais</li>
              <li>ASHRAE TC 9.9: Diretrizes Térmicas para Liquid Cooling</li>
              <li>Uptime Institute: Tier Standards & Topologia Elétrica 2N</li>
              <li>CFE 24/7 Compact: Rastreamento Granular Horário (I-REC)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Metodologia de Latência
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Medições empíricas de RTT em rotas terrestres e cabos submarinos transoceânicos (Firmina, Monet, Seabras-1, Curie, EllaLink).
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Allmera Partners Data Center Consulting · Inteligência de Infraestrutura Elétrica e Sustentabilidade para IA
          </div>
          <div className="flex items-center gap-4">
            <span>Privacidade & Metodologia de Cálculo</span>
            <span>·</span>
            <span>Uso Estritamente Técnico e Decisório</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
