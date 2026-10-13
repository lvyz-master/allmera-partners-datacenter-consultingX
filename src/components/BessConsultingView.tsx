import React, { useState, useMemo } from 'react';
import {
  Zap,
  BatteryCharging,
  Sliders,
  Scale,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  RotateCcw,
  Printer,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  SunMedium,
  ShieldAlert,
  Server,
  ArrowLeftRight,
  LogOut,
  Info,
} from 'lucide-react';
import { AllmeraLogo } from './AllmeraLogo';
import { BessSingleLineDiagram } from './BessSingleLineDiagram';
import { BessExecutiveDossier } from './BessExecutiveDossier';
import {
  BessClientProfile,
  BessSizingInput,
  BessApplicationId,
  BessVendorId,
} from '../types/bess';
import {
  BESS_APPLICATIONS_MENU,
  BRAZIL_BESS_VENDORS,
  BESS_PROJECT_PRESETS,
  BRAZIL_UTILITY_TARIFFS,
} from '../data/bessSolutions';
import { calculateBessSizing } from '../utils/bessSizingEngine';
import {
  renderSingleLineDiagramSvg,
  renderMechanicalLayoutSvg,
  renderDailyDispatchChartSvg,
  renderBatteryDegradationChartSvg,
  renderLiquidCoolingSchematicSvg,
} from '../utils/bessDiagramGenerators';

interface BessConsultingViewProps {
  currentUser: string;
  onLogout: () => void;
  onSwitchPortal: (portal: 'hub' | 'datacenter') => void;
}

export const BessConsultingView: React.FC<BessConsultingViewProps> = ({
  currentUser,
  onLogout,
  onSwitchPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'sizing' | 'vendors' | 'diagram' | 'financial' | 'dossier'>('sizing');

  // Client Profile State initialized with the industrial preset
  const [clientProfile, setClientProfile] = useState<BessClientProfile>({
    clientName: 'Indústria Metalmecânica do Brasil S/A',
    projectName: 'Projeto BESS Peak Shaving & Resiliência 1 MW / 3 MWh',
    city: 'Campinas',
    state: 'SP',
    utilityCompany: 'CPFL Paulista (Interior de SP)',
    subgroup: 'A4 (2.3kV - 25kV)',
    tariffModality: 'Horária Verde',
    connectionVoltage: '13.8 kV',
    peakTariff: 2.12,
    offPeakTariff: 0.48,
    contractedDemandKw: 1500,
    demandTariff: 35.80,
    projectLifeYears: 15,
    waccDiscountRate: 11.0,
  });

  // Sizing Input State
  const [sizingInput, setSizingInput] = useState<BessSizingInput>({
    targetPowerKw: 1000, // 1 MW
    durationHours: 3.0, // 3 hours = 3 MWh
    dailyPeakHours: 3,
    peakLoadKw: 1800,
    offPeakLoadKw: 1200,
    solarPvCapacityKwp: 500,
    cyclesPerDay: 1.0,
    depthOfDischargePercent: 90,
    roundTripEfficiencyPercent: 91,
    annualDegradationPercent: 2.2,
    selectedApplications: ['peak_shaving', 'demand_charge_management', 'critical_backup'],
  });

  // Selected Vendor
  const [selectedVendorId, setSelectedVendorId] = useState<BessVendorId>('huawei');

  // Active Preset ID for highlight
  const [selectedPresetId, setSelectedPresetId] = useState<string>('industrial_peak_shaving');

  // Sizing Engine Calculation
  const sizingResult = useMemo(() => {
    return calculateBessSizing(clientProfile, sizingInput, selectedVendorId);
  }, [clientProfile, sizingInput, selectedVendorId]);

  const selectedVendor = useMemo(() => {
    return BRAZIL_BESS_VENDORS.find((v) => v.id === selectedVendorId) || BRAZIL_BESS_VENDORS[0];
  }, [selectedVendorId]);

  // Handle Preset Selection
  const handleApplyPreset = (presetId: string) => {
    const preset = BESS_PROJECT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setClientProfile((prev) => ({
      ...prev,
      clientName: preset.clientName,
      projectName: `${preset.name} - Dimensionamento BESS`,
      city: preset.city,
      state: preset.state,
      utilityCompany: preset.utilityCompany,
      subgroup: preset.subgroup,
      tariffModality: preset.tariffModality,
      connectionVoltage: preset.connectionVoltage,
      peakTariff: preset.peakTariff,
      offPeakTariff: preset.offPeakTariff,
      demandTariff: preset.demandTariff,
      contractedDemandKw: preset.contractedDemandKw,
    }));

    setSizingInput((prev) => ({
      ...prev,
      targetPowerKw: preset.targetPowerKw,
      durationHours: preset.durationHours,
      dailyPeakHours: preset.dailyPeakHours,
      peakLoadKw: preset.peakLoadKw,
      offPeakLoadKw: preset.offPeakLoadKw,
      solarPvCapacityKwp: preset.solarPvCapacityKwp,
      cyclesPerDay: preset.cyclesPerDay,
      selectedApplications: [...preset.selectedApplications] as BessApplicationId[],
    }));
  };

  // Toggle BESS Application in Cardápio
  const handleToggleApplication = (appId: BessApplicationId) => {
    setSizingInput((prev) => {
      const exists = prev.selectedApplications.includes(appId);
      if (exists) {
        if (prev.selectedApplications.length === 1) return prev; // Keep at least one
        return {
          ...prev,
          selectedApplications: prev.selectedApplications.filter((id) => id !== appId),
        };
      } else {
        return {
          ...prev,
          selectedApplications: [...prev.selectedApplications, appId],
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      
      {/* ============================================================
          TOP NAVIGATION HEADER FOR BESS
         ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Portal Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <AllmeraLogo size="md" subtitle="BESS Consulting" />

            <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <button
                onClick={() => onSwitchPortal('hub')}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                title="Voltar à seleção de consultoria"
              >
                <span>Hub Principal</span>
              </button>
              
              <button
                onClick={() => onSwitchPortal('datacenter')}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Ir para módulo de Data Center"
              >
                <Server className="h-3.5 w-3.5 text-slate-500" />
                <span>DataCentre</span>
              </button>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('sizing')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'sizing'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Dimensionamento & Cardápio</span>
            </button>

            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'vendors'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Comparativo Brasil</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">5 Fabricantes</span>
            </button>

            <button
              onClick={() => setActiveTab('diagram')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'diagram'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Diagrama Unifilar</span>
            </button>

            <button
              onClick={() => setActiveTab('financial')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'financial'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Viabilidade & TCO</span>
            </button>

            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'dossier'
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
                  : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Dossiê BESS (34 Páginas)</span>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full">
                34 Págs
              </span>
            </button>
          </nav>

          {/* Right User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dossier')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Exportar PDF</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{currentUser}</span>
            </div>

            <button
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Encerrar sessão"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sizing')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'sizing' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Dimensionamento
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'vendors' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Fabricantes Brasil
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'diagram' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Diagrama SLD
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'financial' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
          >
            Viabilidade
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-bold ${activeTab === 'dossier' ? 'bg-emerald-700 text-white' : 'text-emerald-700 bg-emerald-100'}`}
          >
            Dossiê PDF
          </button>
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT AREA
         ============================================================ */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB 1: SIZING & CARDÁPIO BESS */}
        {activeTab === 'sizing' && (
          <div className="space-y-8">
            
            {/* Presets Strip */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Templates Prontos para Uso
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Carregar Cenários do Mercado Brasileiro
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Selecione um caso real para pré-preencher tarifas, potência e aplicações do cardápio:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {BESS_PROJECT_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                        {preset.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {preset.name}
                      </h4>
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                        <span>{(preset.targetPowerKw / 1000).toFixed(1)} MW</span>
                        <span>{preset.durationHours}h ({((preset.targetPowerKw * preset.durationHours) / 1000).toFixed(1)} MWh)</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing Engine Grid: Left Controls, Right Real-Time Results */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Inputs & Cardápio) - 7 cols */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section A: Client & Grid Connection Details */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        1. Dados da Unidade Consumidora & Tarifas
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">Grupo A</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Cliente / Razão Social</label>
                      <input
                        type="text"
                        value={clientProfile.clientName}
                        onChange={(e) => setClientProfile({ ...clientProfile, clientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Cidade / Estado</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={clientProfile.city}
                          onChange={(e) => setClientProfile({ ...clientProfile, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                          placeholder="Cidade"
                        />
                        <input
                          type="text"
                          value={clientProfile.state}
                          onChange={(e) => setClientProfile({ ...clientProfile, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                          placeholder="UF"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Distribuidora / Concessionária</label>
                      <select
                        value={clientProfile.utilityCompany}
                        onChange={(e) => {
                          const utility = BRAZIL_UTILITY_TARIFFS.find((u) => u.utility === e.target.value);
                          if (utility) {
                            setClientProfile({
                              ...clientProfile,
                              utilityCompany: utility.utility,
                              state: utility.state,
                              peakTariff: utility.peakKwhGreen,
                              offPeakTariff: utility.offPeakKwh,
                              demandTariff: utility.demandKwMonth,
                            });
                          } else {
                            setClientProfile({ ...clientProfile, utilityCompany: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                      >
                        {BRAZIL_UTILITY_TARIFFS.map((u) => (
                          <option key={u.utility} value={u.utility}>
                            {u.utility} ({u.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Modalidade & Subgrupo</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={clientProfile.tariffModality}
                          onChange={(e) => setClientProfile({ ...clientProfile, tariffModality: e.target.value as any })}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                        >
                          <option value="Horária Verde">Horária Verde</option>
                          <option value="Horária Azul">Horária Azul</option>
                        </select>
                        <select
                          value={clientProfile.subgroup}
                          onChange={(e) => setClientProfile({ ...clientProfile, subgroup: e.target.value as any })}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                        >
                          <option value="A4 (2.3kV - 25kV)">A4 (13.8kV)</option>
                          <option value="A3a (30kV - 44kV)">A3a (34.5kV)</option>
                          <option value="A2 (88kV - 138kV)">A2 (138kV)</option>
                          <option value="A1 (>=230kV)">A1 (230kV)</option>
                        </select>
                      </div>
                    </div>

                    {/* Tariffs input */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Tarifa Ponta (R$/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={clientProfile.peakTariff}
                        onChange={(e) => setClientProfile({ ...clientProfile, peakTariff: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-rose-700 font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Tarifa Fora de Ponta (R$/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.02"
                        value={clientProfile.offPeakTariff}
                        onChange={(e) => setClientProfile({ ...clientProfile, offPeakTariff: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Demanda Contratada (kW)
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={clientProfile.contractedDemandKw}
                        onChange={(e) => setClientProfile({ ...clientProfile, contractedDemandKw: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Tarifa de Demanda (R$/kW.mês)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={clientProfile.demandTariff}
                        onChange={(e) => setClientProfile({ ...clientProfile, demandTariff: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Sizing Parameters (Power, Duration, etc.) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        2. Parâmetros de Dimensionamento BESS
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      C-Rate: {sizingResult.cRate}C
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Power Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Potência Nominal de Descarga (kW)</span>
                        <span className="font-bold text-emerald-700 font-mono text-sm">
                          {sizingInput.targetPowerKw.toLocaleString('pt-BR')} kW ({(sizingInput.targetPowerKw / 1000).toFixed(2)} MW)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="250"
                        max="20000"
                        step="250"
                        value={sizingInput.targetPowerKw}
                        onChange={(e) => setSizingInput({ ...sizingInput, targetPowerKw: parseInt(e.target.value) })}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>250 kW (Comercial)</span>
                        <span>5 MW (Industrial)</span>
                        <span>20 MW (Utility Scale)</span>
                      </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Autonomia Contínua (Horas)</span>
                        <span className="font-bold text-emerald-700 font-mono text-sm">
                          {sizingInput.durationHours} horas • Capacidade: {(sizingInput.targetPowerKw * sizingInput.durationHours / 1000).toFixed(2)} MWh
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="0.5"
                        value={sizingInput.durationHours}
                        onChange={(e) => setSizingInput({ ...sizingInput, durationHours: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>1 hora (1C - Freq/Backup)</span>
                        <span>2 horas (0.5C - Híbrido)</span>
                        <span>3 horas (0.33C - Ponta Brasil)</span>
                        <span>4-6 horas (0.25C - Solar/Long)</span>
                      </div>
                    </div>

                    {/* Solar PV Capacity & Daily Cycles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">
                          Usina Solar FV Hibridizada (kWp)
                        </label>
                        <input
                          type="number"
                          step="100"
                          value={sizingInput.solarPvCapacityKwp}
                          onChange={(e) => setSizingInput({ ...sizingInput, solarPvCapacityKwp: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs bg-white"
                          placeholder="0 se não houver PV"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 text-xs font-semibold mb-1">
                          Ciclos Operacionais por Dia
                        </label>
                        <select
                          value={sizingInput.cyclesPerDay}
                          onChange={(e) => setSizingInput({ ...sizingInput, cyclesPerDay: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs bg-white"
                        >
                          <option value="1.0">1 ciclo/dia (Ponta pura)</option>
                          <option value="1.5">1.5 ciclos/dia (Ponta + Solar)</option>
                          <option value="2.0">2 ciclos/dia (Ponta + Arbitragem)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Cardápio BESS - Multi-Service Menu Selection */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <Sparkles className="h-3 w-3 text-emerald-600" />
                        Cardápio de Serviços de BESS
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        3. Selecione as Aplicações do Cardápio para o Estudo
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      {sizingInput.selectedApplications.length} de {BESS_APPLICATIONS_MENU.length} ativas
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    O dimensionamento e a modelagem de economia financeira são recalculados instantaneamente de acordo com os serviços selecionados abaixo:
                  </p>

                  <div className="space-y-3">
                    {BESS_APPLICATIONS_MENU.map((app) => {
                      const isSelected = sizingInput.selectedApplications.includes(app.id);
                      return (
                        <div
                          key={app.id}
                          onClick={() => handleToggleApplication(app.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="mt-0.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent div
                              className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                            />
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{app.title}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                                  {app.category}
                                </span>
                              </h5>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                {app.typicalSavingsRate}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {app.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {app.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Engineering Sizing & Solution Card - 5 cols */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                
                {/* Real-Time Sizing Summary Card */}
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-white p-5 sm:p-6 shadow-md space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <BatteryCharging className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Balanço de Dimensionamento BESS
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Engenharia Preliminar Allmera
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('dossier')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Ver Dossiê
                    </button>
                  </div>

                  {/* Big Headline Output */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                        Potência & Energia Nominal
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {sizingResult.cRate}C ({sizingInput.durationHours}h)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
                        {sizingResult.nominalPowerMw}
                      </span>
                      <span className="text-lg font-semibold text-emerald-400">MW</span>
                      <span className="text-slate-500 mx-1 text-2xl font-light">/</span>
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
                        {sizingResult.nominalEnergyMwh}
                      </span>
                      <span className="text-lg font-semibold text-emerald-400">MWh</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                      <span>Capacidade Útil (90% DoD):</span>
                      <strong className="text-emerald-300">{sizingResult.usableEnergyMwh} MWh útil</strong>
                    </div>
                  </div>

                  {/* Hardware Breakdown Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Contêineres de Bateria:</span>
                      <strong className="text-slate-900">
                        {sizingResult.batteryContainersCount}x ({sizingResult.containerUnitCapacityMwh} MWh cada)
                      </strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Inversores PCS (Conversão):</span>
                      <strong className="text-slate-900">
                        {sizingResult.pcsInverterCount}x ({sizingResult.pcsUnitRatingKw} kW cada)
                      </strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Skids Transformador MT:</span>
                      <strong className="text-slate-900">
                        {sizingResult.mvTransformerSkidCount}x ({sizingResult.transformerRatingMva} MVA)
                      </strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">Química & Refrigeração:</span>
                      <strong className="text-slate-900">
                        {sizingResult.chemistry} • {selectedVendor.coolingMethod}
                      </strong>
                    </div>

                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-600">Certificações de Fuga:</span>
                      <strong className="text-slate-900">
                        UL 9540A & NFPA 855
                      </strong>
                    </div>
                  </div>

                  {/* Financial Metrics Mini Dashboard */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Retorno & Viabilidade Econômica
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Investimento Turnkey</span>
                        <strong className="text-sm font-bold text-slate-900">
                          R$ {(sizingResult.totalCapexBrl / 1_000_000).toFixed(2)} M
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 block">Economia Anual Líquida</span>
                        <strong className="text-sm font-bold text-emerald-800">
                          R$ {(sizingResult.totalAnnualBenefitBrl / 1_000).toLocaleString('pt-BR')}k/ano
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Payback Simples</span>
                        <strong className="text-sm font-bold text-slate-900">
                          {sizingResult.simplePaybackYears} anos
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 block">TIR (Taxa Interna)</span>
                        <strong className="text-sm font-bold text-emerald-800">
                          {sizingResult.irrPercent}% a.a.
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Selector Pill */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Fabricante Homologado no Dimensionamento:
                    </label>
                    <select
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value as BessVendorId)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 bg-white"
                    >
                      {BRAZIL_BESS_VENDORS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vendorName} ({v.productLine.split('(')[0]}) - R$ {v.estimatedCapexPerKwhBrl}/kWh
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Go to Dossier CTA */}
                  <button
                    onClick={() => setActiveTab('dossier')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white py-3 px-4 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <span>Gerar e Exportar Dossiê em PDF</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: VENDORS COMPARISON IN BRAZIL */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <Scale className="h-3.5 w-3.5 text-emerald-600" />
                  Benchmark Tecnológico & Comercial no Brasil
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                  Comparativo de Soluções BESS Disponíveis no Brasil
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Avaliação detalhada dos 5 fabricantes líderes no mercado brasileiro: Huawei, Sungrow, BYD, WEG e Tesla.
                </p>
              </div>

              <div className="text-xs text-slate-500">
                Solução em uso no projeto: <strong className="text-emerald-700">{selectedVendor.vendorName}</strong>
              </div>
            </div>

            {/* Quadro Resumo Comparativo Brasil — Todos os Fabricantes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <Scale className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Resumo Executivo do Comparativo Brasil (Panorama dos 5 Fabricantes)
                    </h4>
                    <span className="text-xs text-slate-500">
                      Síntese consolidada comparando CAPEX Turnkey, financiamento BNDES, garantias, RTE e suporte local
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {BRAZIL_BESS_VENDORS.length} Fornecedores Homologados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3">Fabricante & Linha</th>
                      <th className="py-2.5 px-3">Arquitetura</th>
                      <th className="py-2.5 px-3 text-center">RTE</th>
                      <th className="py-2.5 px-3">Garantia / Ciclos</th>
                      <th className="py-2.5 px-3 text-right">Capex / kWh</th>
                      <th className="py-2.5 px-3 text-right">Turnkey Estimado</th>
                      <th className="py-2.5 px-3">FINAME / BNDES</th>
                      <th className="py-2.5 px-3">Suporte Local BR</th>
                      <th className="py-2.5 px-3 text-center">Score</th>
                      <th className="py-2.5 px-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BRAZIL_BESS_VENDORS.map((v) => {
                      const isSelected = v.id === selectedVendorId;
                      const estTurnkeyBrl = (v.estimatedCapexPerKwhBrl * sizingResult.nominalEnergyMwh * 1000 * 1.34) / 1_000_000;
                      return (
                        <tr
                          key={v.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>{v.flagCountry}</span>
                              <span>{v.vendorName}</span>
                              {isSelected && (
                                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  Ativo
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">{v.productLine.split('(')[0]}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <div>{v.architectureType}</div>
                            <span className="text-[10px] text-slate-400">{v.coolingMethod}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                            {v.roundTripEfficiency}%
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <div>{v.warrantyYears} anos</div>
                            <span className="text-[10px] text-slate-400">{v.guaranteedCycles.toLocaleString('pt-BR')} ciclos</span>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                            R$ {v.estimatedCapexPerKwhBrl.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-800 tabular-nums">
                            R$ {estTurnkeyBrl.toFixed(2)} M
                          </td>
                          <td className="py-3 px-3">
                            {v.finameBndesEligible ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                100% FINAME
                              </span>
                            ) : v.id === 'byd' ? (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                                Parcial / BR
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                Importação
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {v.brazilLocalPresence.headquarters.split('(')[0]}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-amber-600 tabular-nums">
                            ⭐ {v.overallRating.toFixed(1)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setSelectedVendorId(v.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700'
                              }`}
                            >
                              {isSelected ? '✓ Ativo' : 'Adotar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BRAZIL_BESS_VENDORS.map((v) => {
                const isSelected = v.id === selectedVendorId;
                return (
                  <div
                    key={v.id}
                    className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all bg-white ${
                      isSelected
                        ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{v.flagCountry}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-800">⭐ {v.overallRating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400">/ 5.0</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900">{v.vendorName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{v.productLine}</p>
                      </div>

                      {/* Capex & Finame Badges */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Capex Estimado</span>
                          <strong className="text-sm font-mono text-slate-900">
                            R$ {v.estimatedCapexPerKwhBrl.toLocaleString('pt-BR')} / kWh
                          </strong>
                        </div>
                        <div>
                          {v.finameBndesEligible ? (
                            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              FINAME BNDES
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-[10px]">
                              Importação
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Specs List */}
                      <div className="space-y-2 text-xs text-slate-700">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Arquitetura:</span>
                          <span className="font-semibold text-slate-900">{v.architectureType}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Refrigeração:</span>
                          <span className="font-semibold text-slate-900">{v.coolingMethod}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Garantia / Ciclos:</span>
                          <span className="font-semibold text-slate-900">{v.warrantyYears} anos ({v.guaranteedCycles.toLocaleString('pt-BR')} ciclos)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Eficiência RTE:</span>
                          <span className="font-semibold text-emerald-700">{v.roundTripEfficiency}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Presença no Brasil:</span>
                          <span className="font-semibold text-slate-900">{v.brazilLocalPresence.headquarters.split('(')[0]}</span>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Destaques & Pontos Fortes:
                        </span>
                        {v.strengths.slice(0, 2).map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Select Vendor CTA */}
                    <div className="pt-6">
                      <button
                        onClick={() => setSelectedVendorId(v.id)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ Solução Adotada no Projeto' : 'Adotar esta Solução'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ENGINEERING SCHEMATICS & DIAGRAMS */}
        {activeTab === 'diagram' && (
          <div className="space-y-6">
            {/* Interactive Single Line Diagram */}
            <BessSingleLineDiagram
              sizing={sizingResult}
              vendor={selectedVendor}
              connectionVoltage={clientProfile.connectionVoltage}
              hasSolarPv={sizingInput.solarPvCapacityKwp > 0}
            />

            {/* Conceptual Schematics & Mechanical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mechanical BOP Layout */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    BOP
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Arranjo Físico & Layout Mecânico do Sítio
                    </h4>
                    <span className="text-xs text-slate-500">
                      Footprint ~{sizingResult.batteryContainersCount * 38 + 55} m² • Conforme NFPA 855 e NBR 6118
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: renderMechanicalLayoutSvg({
                      client: clientProfile,
                      input: sizingInput,
                      sizing: sizingResult,
                      vendor: selectedVendor,
                    }),
                  }}
                />
              </div>

              {/* Liquid Cooling Closed-Loop Schematic */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    HVAC
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Esquema Térmico: Liquid Cooling em Circuito Fechado
                    </h4>
                    <span className="text-xs text-slate-500">
                      {selectedVendor.coolingMethod} • Microcanais LFP & Chiller Exterior
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: renderLiquidCoolingSchematicSvg({
                      client: clientProfile,
                      input: sizingInput,
                      sizing: sizingResult,
                      vendor: selectedVendor,
                    }),
                  }}
                />
              </div>
            </div>

            {/* Operational Curves: Daily Dispatch & Degradation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Dispatch Operational Curve */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    24h
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Despacho Operacional Diário (Curva 24 Horas)
                    </h4>
                    <span className="text-xs text-slate-500">
                      Carga na madrugada (R$ {clientProfile.offPeakTariff.toFixed(2)}/kWh) e descarga na ponta (R$ {clientProfile.peakTariff.toFixed(2)}/kWh)
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: renderDailyDispatchChartSvg({
                      client: clientProfile,
                      input: sizingInput,
                      sizing: sizingResult,
                      vendor: selectedVendor,
                    }),
                  }}
                />
              </div>

              {/* Degradation Curve */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    15A
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Curva de Degradação & Retenção de Capacidade (SOH)
                    </h4>
                    <span className="text-xs text-slate-500">
                      {selectedVendor.warrantyYears} anos de garantia • {selectedVendor.guaranteedCycles.toLocaleString('pt-BR')} ciclos garantidos
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: renderBatteryDegradationChartSvg({
                      client: clientProfile,
                      input: sizingInput,
                      sizing: sizingResult,
                      vendor: selectedVendor,
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIAL & TCO */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  Modelagem Financeira & Retorno de Investimento
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-1">
                  Demonstrativo de Fluxo de Caixa, CAPEX, OPEX e Indicadores
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Horizonte de 15 anos com taxa de desconto WACC de {clientProfile.waccDiscountRate}% a.a. e degradação de {sizingInput.annualDegradationPercent}% a.a.
                </p>
              </div>

              {/* 4 Big Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Payback Simples</span>
                  <div className="text-2xl font-bold tracking-tight tabular-nums text-slate-900 mt-1">{sizingResult.simplePaybackYears} anos</div>
                  <span className="text-xs text-slate-500">Retorno do capital investido</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Payback Descontado</span>
                  <div className="text-2xl font-bold tracking-tight tabular-nums text-slate-900 mt-1">{sizingResult.discountedPaybackYears} anos</div>
                  <span className="text-xs text-slate-500">Considerando WACC de 11%</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">TIR (Taxa Interna)</span>
                  <div className="text-2xl font-bold tracking-tight tabular-nums text-emerald-900 mt-1">{sizingResult.irrPercent}%</div>
                  <span className="text-xs text-emerald-700">Rentabilidade anual do projeto</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">VPL (15 Anos)</span>
                  <div className="text-2xl font-bold tracking-tight tabular-nums text-emerald-900 mt-1">
                    R$ {(sizingResult.npvBrl / 1_000_000).toFixed(2)} M
                  </div>
                  <span className="text-xs text-emerald-700">Valor presente líquido positivo</span>
                </div>
              </div>

              {/* Capex vs Annual Savings Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Composição do CAPEX Turnkey:
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Baterias & Contêineres:</span>
                      <strong className="font-mono text-slate-900">R$ {sizingResult.bessEquipmentCapexBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">PCS & Transformador:</span>
                      <strong className="font-mono text-slate-900">R$ {sizingResult.pcsAndTransformerCapexBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">BOP Civil e Elétrico:</span>
                      <strong className="font-mono text-slate-900">R$ {sizingResult.bopCivilElectricalCapexBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Engenharia & EPC:</span>
                      <strong className="font-mono text-slate-900">R$ {sizingResult.engineeringCommissioningCapexBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-2 bg-emerald-100/70 px-2 rounded-lg font-bold text-emerald-900">
                      <span>Total Turnkey:</span>
                      <span className="font-mono text-sm">R$ {sizingResult.totalCapexBrl.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Benefícios Anuais por Aplicação (R$/ano):
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Peak Shaving (Horário de Ponta):</span>
                      <strong className="font-mono text-emerald-700">R$ {sizingResult.annualPeakShavingSavingsBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Arbitragem de Energia no ACL:</span>
                      <strong className="font-mono text-emerald-700">R$ {sizingResult.annualArbitrageRevenueBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Redução de Demanda Contratada:</span>
                      <strong className="font-mono text-emerald-700">R$ {sizingResult.annualDemandReductionSavingsBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Custos OPEX Anuais (1.7% Capex):</span>
                      <strong className="font-mono text-rose-600">- R$ {sizingResult.annualOpexBrl.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between py-2 bg-slate-200/80 px-2 rounded-lg font-bold text-slate-900">
                      <span>Benefício Líquido Anual:</span>
                      <span className="font-mono text-sm text-emerald-800">
                        R$ {(sizingResult.totalAnnualBenefitBrl - sizingResult.annualOpexBrl).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LCOS Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Custo Nivelado de Armazenamento (LCOS):</span>
                  <span className="text-slate-500">Custo integral por cada kWh descarregado ao longo da vida útil do sistema</span>
                </div>
                <div className="text-lg font-black font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                  R$ {sizingResult.lcosBrlPerKwh.toFixed(2)} / kWh
                </div>
              </div>

              {/* Quadro Resumo Comercial: Comparativo de Fabricantes no Brasil */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Scale className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Resumo Comercial Comparativo Brasil — Todos os Fabricantes
                      </h4>
                      <span className="text-xs text-slate-500">
                        Avaliação de CAPEX, elegibilidade FINAME / BNDES, garantias e payback para a usina de {sizingResult.nominalPowerMw} MW / {sizingResult.nominalEnergyMwh} MWh
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">
                    Solução Ativa: <strong className="text-emerald-700">{selectedVendor.vendorName}</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        <th className="py-2.5 px-3">Fabricante & Linha</th>
                        <th className="py-2.5 px-3">Arquitetura</th>
                        <th className="py-2.5 px-3 text-center">RTE</th>
                        <th className="py-2.5 px-3">Garantia / Ciclos</th>
                        <th className="py-2.5 px-3 text-right">Capex / kWh</th>
                        <th className="py-2.5 px-3 text-right">Turnkey Total</th>
                        <th className="py-2.5 px-3 text-center">Payback Est.</th>
                        <th className="py-2.5 px-3">FINAME / BNDES</th>
                        <th className="py-2.5 px-3">Suporte no Brasil</th>
                        <th className="py-2.5 px-3 text-center">Score</th>
                        <th className="py-2.5 px-3 text-center">Seleção</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {BRAZIL_BESS_VENDORS.map((v) => {
                        const isSelected = v.id === selectedVendorId;
                        const estTurnkeyBrl = (v.estimatedCapexPerKwhBrl * sizingResult.nominalEnergyMwh * 1000 * 1.34);
                        const estAnnualOpex = estTurnkeyBrl * 0.017;
                        const estNetBenefit = sizingResult.totalAnnualBenefitBrl - estAnnualOpex;
                        const estPb = estNetBenefit > 0 ? (estTurnkeyBrl / estNetBenefit).toFixed(1) : '-';

                        return (
                          <tr
                            key={v.id}
                            className={`transition-colors ${
                              isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                <span>{v.flagCountry}</span>
                                <span>{v.vendorName}</span>
                                {isSelected && (
                                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    Adotado
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-normal block">{v.productLine.split('(')[0]}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-normal">
                              <div>{v.architectureType}</div>
                              <span className="text-[10px] text-slate-400">{v.coolingMethod}</span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-emerald-700 tabular-nums">
                              {v.roundTripEfficiency}%
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-normal">
                              <div>{v.warrantyYears} anos</div>
                              <span className="text-[10px] text-slate-400">{v.guaranteedCycles.toLocaleString('pt-BR')} ciclos</span>
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                              R$ {v.estimatedCapexPerKwhBrl.toLocaleString('pt-BR')}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-emerald-800 tabular-nums">
                              R$ {(estTurnkeyBrl / 1_000_000).toFixed(2)} M
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-slate-900 tabular-nums">
                              {estPb} anos
                            </td>
                            <td className="py-3 px-3">
                              {v.finameBndesEligible ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  100% FINAME
                                </span>
                              ) : v.id === 'byd' ? (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                                  Parcial / BR
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                  Importação
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-slate-600 text-[11px] font-normal">
                              {v.brazilLocalPresence.headquarters.split('(')[0]}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-amber-600 tabular-nums">
                              ⭐ {v.overallRating.toFixed(1)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => setSelectedVendorId(v.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700'
                                }`}
                              >
                                {isSelected ? '✓ Adotado' : 'Simular'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Parecer Comercial Allmera:</strong> Você pode simular qualquer fabricante clicando em <em>"Simular"</em> acima. O fluxo de caixa, LCOS e Dossiê serão automaticamente recalculados.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('dossier')}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ver no Dossiê (PDF)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOSSIER EXPORTABLE TO PDF */}
        {activeTab === 'dossier' && (
          <BessExecutiveDossier
            client={clientProfile}
            input={sizingInput}
            sizing={sizingResult}
            vendor={selectedVendor}
            onBackToConfig={() => setActiveTab('sizing')}
          />
        )}

      </main>
    </div>
  );
};
