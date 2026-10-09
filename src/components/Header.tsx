import React, { useState } from 'react';
import { Cpu, Menu, X, Map, BarChart3, Zap, Globe, Shield, Sliders, Home, Scale, LogOut, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAdvisor: () => void;
  currentUser?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAdvisor,
  currentUser = 'Allmera',
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    { id: 'map', label: 'Mapa Continental', icon: Map },
    { id: 'vendors', label: 'Huawei vs Concorrentes', icon: Scale, highlight: true },
    { id: 'regions', label: 'Polos Regionais', icon: BarChart3 },
    { id: 'grid', label: 'Desafios Elétricos', icon: Zap },
    { id: 'latency', label: 'Latência & Fibra', icon: Globe },
    { id: 'regulatory', label: 'Políticas Renováveis', icon: Shield },
    { id: 'simulator', label: 'Simulador', icon: Sliders },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark with dedicated Allmera Partners emblem */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSelectTab('overview')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-slate-200/90 shadow-xs bg-white shrink-0 group-hover:border-emerald-500 transition-colors">
              <img
                src="/src/assets/images/allmera_logo_1791575083091.jpg"
                alt="Allmera Partners Data Center Consulting Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Allmera Partners
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">
                Data Center Consulting
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links for Desktop */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-700 font-bold border-b-2 border-emerald-600'
                    : 'hover:text-slate-900'
                } ${item.highlight && !isActive ? 'text-slate-800 font-semibold' : ''}`}
              >
                {item.highlight && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action, User Status & Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-emerald-600 shadow-xs cursor-pointer"
          >
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline whitespace-nowrap">Consultoria IA Executiva</span>
            <span className="sm:hidden">Consultoria IA</span>
          </button>

          {/* User profile indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-900">{currentUser}</span>
          </div>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer"
              title="Sair do portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sub-bar on Medium screens (horizontal pill scroll) */}
      <div className="hidden md:flex lg:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 gap-3 text-xs bg-slate-50/70">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
              activeTab === item.id
                ? 'bg-white text-emerald-800 font-bold shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
