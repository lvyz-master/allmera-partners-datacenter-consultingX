import React, { useState } from 'react';
import {
  Cpu,
  Menu,
  X,
  Map,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Sliders,
  Home,
  Scale,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { AllmeraLogo } from './AllmeraLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAdvisor?: () => void;
  currentUser?: string;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  desc?: string;
  highlight?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAdvisor,
  currentUser = 'Allmera',
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Structured nav items
  const primaryNavItems: NavItem[] = [
    { id: 'overview', label: 'Visão Geral', icon: Home },
    {
      id: 'vendors',
      label: 'Comercial',
      icon: Scale,
      badge: 'Estudo TCO',
      highlight: true,
    },
    { id: 'map', label: 'Mapa Continental', icon: Map },
    { id: 'regions', label: 'Polos Regionais', icon: BarChart3 },
    { id: 'simulator', label: 'Simulador', icon: Sliders },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'grid', label: 'Desafios Elétricos', icon: Zap, desc: 'Capacidade de subestações e conexão' },
    { id: 'latency', label: 'Latência & Fibra', icon: Globe, desc: 'Cabos submarinos e rotas terrestres' },
    { id: 'regulatory', label: 'Políticas Renováveis', icon: Shield, desc: 'PPAs, autoprodução e marcos legais' },
  ];

  const allNavItems: NavItem[] = [
    ...primaryNavItems,
    ...secondaryNavItems,
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Allmera Partners Brand with elegant green "A" */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => handleSelectTab('overview')}
            className="flex items-center text-left group cursor-pointer focus:outline-none transition-transform active:scale-[0.99]"
            title="Allmera Partners Data Center Consulting"
          >
            <AllmeraLogo size="md" />
          </button>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium">
          {/* Main 5 items */}
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`relative px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Infrastructure dropdown for Grid, Latency, Regulatory */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                isSecondaryActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>Infraestrutura & Redes</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  moreDropdownOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {moreDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2.5 py-1">
                  Estudos Técnicos Especializados
                </div>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-md mt-0.5 ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold leading-snug">{item.label}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Medium Screen View: Compact horizontal nav buttons (lg up to xl) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1 text-xs">
          {primaryNavItems.slice(0, 3).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer flex items-center gap-1 font-medium"
          >
            <span>+ Modulos ({allNavItems.length - 3})</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </nav>

        {/* Right: Actions (User profile, Logout, Mobile toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User profile indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-semibold text-slate-900">{currentUser}</span>
          </div>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-xl border border-slate-200/90 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-xl space-y-1 animate-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 mb-2">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-800">
              Módulos de Consultoria & Estudos
            </div>
            <div className="text-xs text-slate-500">
              Navegue pelos relatórios técnicos de data center
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      TCO
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Footer Status & Logout */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Conectado como <strong>{currentUser}</strong></span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
