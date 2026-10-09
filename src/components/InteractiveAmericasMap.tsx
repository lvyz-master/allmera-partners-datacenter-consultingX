import React, { useState } from 'react';
import { REGIONS_DATA } from '../data/regionsData';
import { RegionData } from '../types/datacenter';
import { 
  Zap, 
  Globe, 
  Leaf, 
  Clock, 
  ArrowRight, 
  Cpu, 
  Droplets, 
  Activity, 
  Layers, 
  Sparkles, 
  Info, 
  ArrowUpDown, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface InteractiveAmericasMapProps {
  onSelectRegion: (regionId: string) => void;
  onOpenAiAssessment: (region: RegionData) => void;
  onSimulateRegion: (regionId: string) => void;
}

type MapLayer = 
  | 'overview' 
  | 'grid_queue' 
  | 'renewables' 
  | 'tariffs' 
  | 'capacity' 
  | 'cables' 
  | 'water_cooling';

export const InteractiveAmericasMap: React.FC<InteractiveAmericasMapProps> = ({
  onSelectRegion,
  onOpenAiAssessment,
  onSimulateRegion,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('overview');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string>('br-sp');
  const [compareRegionId, setCompareRegionId] = useState<string | null>('us-nova');
  const [hoveredCableId, setHoveredCableId] = useState<string | null>(null);

  // SVG Coordinates mapped precisely to a balanced Americas continental projection (960 x 780)
  const nodeCoordinates: Record<string, { x: number; y: number; labelAnchor?: 'left' | 'right' }> = {
    'ca-qc': { x: 610, y: 135, labelAnchor: 'right' },     // Montreal / Quebec
    'us-nova': { x: 575, y: 220, labelAnchor: 'right' },   // Northern Virginia / Ashburn
    'us-tx': { x: 410, y: 285, labelAnchor: 'left' },      // Texas ERCOT / Dallas
    'mx-qro': { x: 370, y: 380, labelAnchor: 'left' },     // Querétaro
    'cr-sjo': { x: 475, y: 475, labelAnchor: 'left' },     // Costa Rica
    'pa-pty': { x: 515, y: 495, labelAnchor: 'right' },    // Panama City
    'co-bog': { x: 550, y: 535, labelAnchor: 'left' },     // Bogotá
    'br-ce': { x: 825, y: 565, labelAnchor: 'right' },     // Fortaleza / Ceará
    'br-sp': { x: 755, y: 685, labelAnchor: 'right' },     // São Paulo
    'cl-stgo': { x: 575, y: 725, labelAnchor: 'left' },    // Santiago
  };

  const selectedRegion = REGIONS_DATA.find((r) => r.id === selectedPinId) || REGIONS_DATA[0];
  const compareRegion = compareRegionId ? REGIONS_DATA.find((r) => r.id === compareRegionId) : null;
  const hoveredRegion = hoveredRegionId ? REGIONS_DATA.find((r) => r.id === hoveredRegionId) : null;

  // Key Subsea Cables mapped across the Atlantic and Pacific oceans
  const cableRoutes = [
    {
      id: 'firmina',
      name: 'Cabo Firmina (Google)',
      path: 'M 575,220 C 690,320 810,430 825,565 C 835,630 790,665 755,685 C 720,705 650,725 615,735',
      color: '#059669', // Emerald
      capacity: 'Super alta capacidade (12 pares de fibra)',
      details: 'Myrtle Beach / VA → Fortaleza → Santos / São Paulo → Las Toninas ARG (alimentação por extremidade única)',
    },
    {
      id: 'monet',
      name: 'Sistemas Monet & Seabras-1',
      path: 'M 535,270 C 660,360 770,460 825,565 C 800,630 775,665 755,685',
      color: '#0284c7', // Cyan
      capacity: '64 Tbps+ / Baixa latência direta',
      details: 'Boca Raton FL / Wall Township NJ → Fortaleza → Santos/SP (RTT ~65ms até Fortaleza e 104ms até SP)',
    },
    {
      id: 'curie',
      name: 'Cabo Curie (Google)',
      path: 'M 210,210 C 270,360 380,510 500,620 C 540,660 565,700 575,725',
      color: '#d97706', // Amber
      capacity: '72 Tbps / Rota direta Pacífico',
      details: 'Los Angeles Califórnia → Valparaíso / Santiago Chile (rota suboceânica direta sem cruzar a cordilheira)',
    },
    {
      id: 'ellalink',
      name: 'Cabo EllaLink (Transatlântico Europa)',
      path: 'M 825,565 C 865,510 890,440 910,380',
      color: '#7c3aed', // Purple
      capacity: '100 Tbps / Conexão direta com a Europa',
      details: 'Fortaleza Brasil → Sines / Lisboa Portugal (58ms RTT sem trânsito por operadoras norte-americanas)',
    },
    {
      id: 'caribbean',
      name: 'Anel do Caribe & América Central (ARCOS / Maya-1 / CFX-1)',
      path: 'M 535,270 C 475,340 430,410 475,475 C 495,485 515,495 550,535',
      color: '#0d9488', // Teal
      capacity: 'Malha resiliente de alta disponibilidade',
      details: 'Flórida / Miami → México → Costa Rica → Panamá → Colômbia (tempo de trânsito 38ms a 44ms para Miami)',
    },
    {
      id: 'sacs',
      name: 'SACS (South Atlantic Cable System)',
      path: 'M 825,565 C 870,580 910,610 940,635',
      color: '#e11d48', // Rose
      capacity: '40 Tbps / Conexão Sul-Sul',
      details: 'Fortaleza Brasil → Luanda Angola (62ms RTT ligando a América Latina ao continente africano e Ásia)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Cartografia Estratégica Continental · Bruno Zavaleta DataCenter</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mapa de Infraestrutura de IA, Fila Elétrica & Cabos Submarinos
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Inspeção geográfica interativa dos 10 polos de inteligência artificial nas Américas. Compare prazos de subestação, custos de energia, matriz limpa, cabos transoceânicos e restrições de resfriamento hídrico.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSimulateRegion(selectedPinId)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>Simular Datacenter</span>
          </button>
        </div>
      </div>

      {/* Top Continental Intelligence Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>⚡ Menor Fila Elétrica</span>
            <span className="text-emerald-700 font-bold">18 meses</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            Fortaleza & Panamá
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Contra 60+ meses na Virgínia (Dominion Energy)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>🌿 Matriz Mais Limpa</span>
            <span className="text-emerald-700 font-bold">99% CFE</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            Quebec & Costa Rica
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Hidroelétrica contínua e geotermia 24/7
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>💰 Menor Tarifa $/MWh</span>
            <span className="text-emerald-700 font-bold">$48 - $52</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            Quebec & Nordeste Brasil
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Autoprodução isenta de encargos CDE
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>🌐 Hub Conectividade</span>
            <span className="text-cyan-700 font-bold">16 Cabos</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            Fortaleza & Ashburn
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Rotas diretas para EUA, Europa e África
          </div>
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2">
        <div className="text-xs font-semibold text-slate-700 px-2 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-emerald-600" />
          <span>Camada de Visualização:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { id: 'overview', label: 'Visão Geral Integrada' },
            { id: 'grid_queue', label: 'Fila de Conexão Elétrica' },
            { id: 'renewables', label: 'Matriz Renovável (%)' },
            { id: 'tariffs', label: 'Tarifa Industrial ($/MWh)' },
            { id: 'capacity', label: 'Capacidade (MW)' },
            { id: 'cables', label: 'Cabos Submarinos & RTT' },
            { id: 'water_cooling', label: 'Estresse Hídrico & Resfriamento' },
          ].map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                  isActive
                    ? 'bg-white text-emerald-800 font-bold shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {layer.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Geographic Grid: 8 Cols Map + 4 Cols Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs relative overflow-hidden">
          {/* Top Left Live Legend & Metric Indicator */}
          <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 text-xs shadow-xs space-y-1.5 max-w-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {activeLayer === 'overview' && 'Polos de Dados das Américas'}
                {activeLayer === 'grid_queue' && 'Tempo de Fila de Subestação (Meses)'}
                {activeLayer === 'renewables' && '% de Eletricidade Limpa na Rede'}
                {activeLayer === 'tariffs' && 'Custo Médio de Energia Industrial'}
                {activeLayer === 'capacity' && 'Capacidade Elétrica Disponível (MW)'}
                {activeLayer === 'cables' && 'Rotas de Cabos Submarinos Transoceânicos'}
                {activeLayer === 'water_cooling' && 'Índice de Estresse Hídrico & Regulação'}
              </span>
            </div>
            
            <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              {activeLayer === 'grid_queue' && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> ≤ 24m (Ágil)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 25-36m</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> &gt; 36m (Crítico)</span>
                </div>
              )}
              {activeLayer === 'renewables' && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> &gt; 80% (Verde)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-cyan-600" /> 50-80%</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> &lt; 50%</span>
                </div>
              )}
              {activeLayer === 'tariffs' && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> ≤ $65/MWh</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> $66-$90</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> &gt; $90</span>
                </div>
              )}
              {activeLayer === 'water_cooling' && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Baixo</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Médio</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Extremo (Proibição)</span>
                </div>
              )}
              {(activeLayer === 'overview' || activeLayer === 'cables' || activeLayer === 'capacity') && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Mercado Emergente</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-800" /> Polo Maduro</span>
                </div>
              )}
            </div>
          </div>

          {/* SVG Map Graphic */}
          <div className="w-full aspect-[4/3] max-h-[660px] flex items-center justify-center">
            <svg
              viewBox="0 0 960 780"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.02))' }}
            >
              {/* Continental Vector Base of the Americas */}
              <g className="fill-slate-100/90 stroke-slate-300 stroke-[1.2]">
                {/* North America: Canada & US */}
                <path d="M 160,60 Q 240,40 380,50 Q 520,30 630,65 Q 670,90 640,150 Q 610,185 575,220 Q 535,270 410,285 Q 360,310 320,360 Q 240,300 180,240 Q 140,160 160,60 Z" />
                {/* Mexico & Central America */}
                <path d="M 320,360 Q 370,380 430,420 Q 475,475 515,495 Q 545,510 515,525 Q 460,490 380,440 Q 330,410 320,360 Z" />
                {/* Caribbean Islands */}
                <ellipse cx="490" cy="380" rx="35" ry="8" />
                <ellipse cx="560" cy="410" rx="20" ry="6" />
                {/* South America: Colombia, Brazil, Chile, Argentina */}
                <path d="M 515,525 Q 640,510 740,530 Q 840,550 860,610 Q 830,700 755,735 Q 670,765 600,770 Q 550,710 560,610 Q 510,560 515,525 Z" />
              </g>

              {/* Subsea Fiber Cables Layer */}
              {(activeLayer === 'overview' || activeLayer === 'cables') && (
                <g className="transition-opacity duration-300">
                  {cableRoutes.map((cable) => {
                    const isHovered = hoveredCableId === cable.id;
                    return (
                      <g
                        key={cable.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCableId(cable.id)}
                        onMouseLeave={() => setHoveredCableId(null)}
                      >
                        {/* Glow halo on hover */}
                        {isHovered && (
                          <path
                            d={cable.path}
                            fill="none"
                            stroke={cable.color}
                            strokeWidth="6"
                            className="opacity-40"
                          />
                        )}
                        <path
                          d={cable.path}
                          fill="none"
                          stroke={cable.color}
                          strokeWidth={isHovered ? '3.5' : '2.2'}
                          strokeDasharray={cable.id === 'ellalink' ? '6 4' : 'none'}
                          className={`transition-all ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Data Center Hub Pins */}
              {REGIONS_DATA.map((region) => {
                const pos = nodeCoordinates[region.id];
                if (!pos) return null;

                const isSelected = region.id === selectedRegion.id;
                const isHovered = region.id === hoveredRegionId;

                // Color and label according to active layer
                let pinColor = region.marketTier === 'emerging' ? '#059669' : '#1e293b';
                let metricBadge = '';

                if (activeLayer === 'grid_queue') {
                  const m = region.grid.interconnectionQueueMonths;
                  pinColor = m <= 24 ? '#059669' : m <= 36 ? '#d97706' : '#e11d48';
                  metricBadge = `${m} meses`;
                } else if (activeLayer === 'renewables') {
                  const r = region.grid.gridRenewablePercentage;
                  pinColor = r >= 80 ? '#059669' : r >= 50 ? '#0284c7' : '#64748b';
                  metricBadge = `${r}% limpo`;
                } else if (activeLayer === 'tariffs') {
                  const t = region.grid.averageIndustrialTariffUsdMwh;
                  pinColor = t <= 65 ? '#059669' : t <= 90 ? '#d97706' : '#e11d48';
                  metricBadge = `$${t}/MWh`;
                } else if (activeLayer === 'capacity') {
                  pinColor = region.grid.availableCapacityMw >= 500 ? '#059669' : '#0284c7';
                  metricBadge = `${region.grid.availableCapacityMw} MW`;
                } else if (activeLayer === 'water_cooling') {
                  const w = region.regulatory.waterStressLevel;
                  pinColor = w === 'Extremo' ? '#e11d48' : w === 'Alto' ? '#d97706' : w === 'Médio' ? '#0284c7' : '#059669';
                  metricBadge = `Água: ${w}`;
                } else {
                  // Overview
                  metricBadge = region.marketTier === 'emerging' ? 'LATAM' : 'Maduro';
                }

                return (
                  <g
                    key={region.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => {
                      setSelectedPinId(region.id);
                      onSelectRegion(region.id);
                    }}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                  >
                    {/* Animated ping ring when selected */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="20"
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="2.5"
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Outer halo */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isHovered ? '13' : '9.5'}
                      fill="white"
                      stroke={pinColor}
                      strokeWidth="3.2"
                      className="shadow-sm transition-all duration-200"
                    />

                    {/* Inner core */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isHovered ? '5.5' : '4'}
                      fill={pinColor}
                    />

                    {/* Label Tag */}
                    <g transform={`translate(${pos.x + 14}, ${pos.y + 4})`}>
                      <rect
                        x="-2"
                        y="-13"
                        width={region.name.split(' ')[0].length * 7 + (metricBadge ? 58 : 14)}
                        height="22"
                        rx="5"
                        fill="rgba(255, 255, 255, 0.96)"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                        className="shadow-xs"
                      />
                      <text
                        x="5"
                        y="2"
                        fontSize="10.5"
                        fontFamily="var(--font-sans)"
                        fontWeight="700"
                        fill="#0f172a"
                      >
                        {region.name.split(' ')[0]}
                      </text>
                      {metricBadge && (
                        <text
                          x={region.name.split(' ')[0].length * 7 + 8}
                          y="2"
                          fontSize="9.5"
                          fontFamily="var(--font-mono)"
                          fontWeight="700"
                          fill={pinColor}
                        >
                          · {metricBadge}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Subsea Cable Legend Drawer */}
          {(activeLayer === 'overview' || activeLayer === 'cables') && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Cabos Submarinos Mapeados:</span>
                <span className="text-[11px] text-slate-500 font-normal">Passe o cursor sobre os nomes para inspecionar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {cableRoutes.map((cable) => (
                  <div
                    key={cable.id}
                    onMouseEnter={() => setHoveredCableId(cable.id)}
                    onMouseLeave={() => setHoveredCableId(null)}
                    className={`rounded-lg border p-2 transition-all cursor-pointer text-xs ${
                      hoveredCableId === cable.id
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="h-2 w-3 rounded-full" style={{ backgroundColor: cable.color }} />
                      <span className="truncate">{cable.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {cable.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Intelligence Inspector & Hub Comparator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Selected Hub Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={selectedRegion.country}>
                  {selectedRegion.flag}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {selectedRegion.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{selectedRegion.country}</span>
                    <span>·</span>
                    <span className={selectedRegion.marketTier === 'emerging' ? 'text-emerald-700 font-bold' : 'text-slate-800 font-semibold'}>
                      {selectedRegion.marketTier === 'emerging' ? 'Mercado Emergente' : 'Polo Maduro'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedRegion.grid.substationVoltageKv.split('/')[0]}
                </span>
              </div>
            </div>

            {/* Core Metrics 4-Box Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Fila de Subestação</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {selectedRegion.grid.interconnectionQueueMonths} meses
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">CapEx Sub: ${selectedRegion.grid.substationCostPerMwUsd / 1000}k/MW</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Matriz Limpa</span>
                </div>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                  {selectedRegion.grid.gridRenewablePercentage}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Fóssil: {selectedRegion.grid.fossilPercentage}%</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-cyan-700" />
                  <span>Tarifa Industrial</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  ${selectedRegion.grid.averageIndustrialTariffUsdMwh}/MWh
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Antes de autoprodução</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-purple-700" />
                  <span>Capacidade Disp.</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {selectedRegion.grid.availableCapacityMw} MW
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pipeline: {selectedRegion.grid.pipelineCapacityMw} MW</div>
              </div>
            </div>

            {/* Suitability & Latency Brief */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Vocação de Carga de IA:</span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">
                  Treino: {selectedRegion.primaryWorkloadSuitability.llmTrainingScore}/100 · Inferência: {selectedRegion.primaryWorkloadSuitability.realtimeInferenceScore}/100
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-lg text-[11px]">
                {selectedRegion.primaryWorkloadSuitability.summary}
              </p>
            </div>

            {/* Water and Cooling Constraint */}
            <div className="rounded-lg border border-slate-200 p-3 text-xs bg-slate-50/70 space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-cyan-600" />
                <span>Resfriamento & Estresse Hídrico ({selectedRegion.regulatory.waterStressLevel}):</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {selectedRegion.regulatory.coolingRegulations}
              </p>
            </div>

            {/* Actions for this Hub */}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => onOpenAiAssessment(selectedRegion)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 py-2.5 text-xs font-bold text-emerald-800 transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Solicitar Parecer de IA para {selectedRegion.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => onSimulateRegion(selectedRegion.id)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <span>Simular Datacenter neste Polo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Side-by-Side Hub Comparator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Comparar com Outro Polo</h4>
              </div>
              <select
                value={compareRegionId || ''}
                onChange={(e) => setCompareRegionId(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium focus:outline-emerald-600 cursor-pointer"
              >
                {REGIONS_DATA.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.id === selectedRegion.id}>
                    {r.flag} {r.name.split(' ')[0]} ({r.country})
                  </option>
                ))}
              </select>
            </div>

            {compareRegion && (
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900 truncate">{selectedRegion.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500">{selectedRegion.country}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                    <div className="font-bold text-emerald-950 truncate">{compareRegion.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-emerald-700">{compareRegion.country}</div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Fila Elétrica</span>
                    <span className="font-bold">
                      {selectedRegion.grid.interconnectionQueueMonths}m vs {compareRegion.grid.interconnectionQueueMonths}m
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Matriz Renovável</span>
                    <span className="font-bold text-emerald-700">
                      {selectedRegion.grid.gridRenewablePercentage}% vs {compareRegion.grid.gridRenewablePercentage}%
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Tarifa $/MWh</span>
                    <span className="font-bold">
                      ${selectedRegion.grid.averageIndustrialTariffUsdMwh} vs ${compareRegion.grid.averageIndustrialTariffUsdMwh}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Capacidade Disp.</span>
                    <span className="font-bold">
                      {selectedRegion.grid.availableCapacityMw} MW vs {compareRegion.grid.availableCapacityMw} MW
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Estresse Hídrico</span>
                    <span className="font-bold">
                      {selectedRegion.regulatory.waterStressLevel} vs {compareRegion.regulatory.waterStressLevel}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
