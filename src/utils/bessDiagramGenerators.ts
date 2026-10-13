/**
 * Helper to render high-fidelity conceptual electrical, mechanical, and analytical SVG diagrams
 * for both the web viewer (BessExecutiveDossier) and the PDF exporter (bessPdfExporter).
 */
import { BessClientProfile, BessSizingInput, BessSizingResult, BessVendorProduct } from '../types/bess';

export interface DiagramConfig {
  client: BessClientProfile;
  input: BessSizingInput;
  sizing: BessSizingResult;
  vendor: BessVendorProduct;
}

/**
 * 1. DIAGRAMA UNIFILAR CONCEITUAL EXECUTIVO (SLD - Single Line Diagram)
 * Mostra o fluxo completo: Células DC -> Racks DC -> Chave DC -> PCS Inversor -> Filtro LCL ->
 * Skid Trafo Elevador (Dyn1) -> Cubículo MT (ANSI 50/51/27/59) -> Medição CCEE -> Rede Concessionária & Cargas Críticas.
 */
export function renderSingleLineDiagramSvg(cfg: DiagramConfig): string {
  const { client, sizing, vendor } = cfg;
  const voltage = client.connectionVoltage || '13.8 kV';

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0f172a; border-radius: 8px; padding: 10px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px; font-size: 8.5pt;">
      <span style="font-weight: 700; color: #34d399; letter-spacing: 0.5px;">⚡ ESQUEMA ELÉTRICO CONCEITUAL: DIAGRAMA UNIFILAR EXECUTIVO (SLD)</span>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Tensão PAC: ${voltage} • ${sizing.nominalPowerMw} MW / ${sizing.nominalEnergyMwh} MWh</span>
    </div>
    <svg viewBox="0 0 880 230" style="width: 100%; height: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px;">
      <!-- Background subtle grid -->
      <defs>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5"/>
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
        </marker>
        <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
        </marker>
      </defs>
      <rect width="880" height="230" fill="#0b1120" rx="6" />
      <rect width="880" height="230" fill="url(#gridPattern)" rx="6" />

      <!-- SECTION 1: DC BATTERY STORAGE SYSTEM -->
      <g transform="translate(15, 20)">
        <rect x="0" y="0" width="160" height="185" rx="6" fill="#132338" stroke="#059669" stroke-width="1.5" stroke-dasharray="3,3" />
        <rect x="8" y="8" width="144" height="20" rx="3" fill="#065f46" />
        <text x="80" y="22" fill="#ecfdf5" font-size="9" font-weight="bold" text-anchor="middle">CONTÊINER BESS (DC)</text>
        
        <!-- Battery racks symbol -->
        <g transform="translate(18, 38)">
          <!-- Rack 1 -->
          <rect x="0" y="0" width="55" height="50" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="1" />
          <text x="27" y="16" fill="#34d399" font-size="8" font-weight="bold" text-anchor="middle">RACK DC #1</text>
          <text x="27" y="28" fill="#94a3b8" font-size="7" text-anchor="middle">LFP 314Ah</text>
          <text x="27" y="40" fill="#cbd5e1" font-size="7" text-anchor="middle">1331V DC</text>

          <!-- Rack 2 -->
          <rect x="68" y="0" width="55" height="50" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="1" />
          <text x="95" y="16" fill="#34d399" font-size="8" font-weight="bold" text-anchor="middle">RACK DC #N</text>
          <text x="95" y="28" fill="#94a3b8" font-size="7" text-anchor="middle">${sizing.batteryContainersCount}x Contêiner</text>
          <text x="95" y="40" fill="#cbd5e1" font-size="7" text-anchor="middle">1331V DC</text>
        </g>

        <!-- BMS & DC Protection Box -->
        <rect x="18" y="100" width="124" height="40" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1" />
        <text x="80" y="115" fill="#a7f3d0" font-size="8" font-weight="bold" text-anchor="middle">BMS 3 Níveis + Seccionadora</text>
        <text x="80" y="128" fill="#94a3b8" font-size="7" text-anchor="middle">Disjuntor DC 1500V + Fusíveis Ultra-rápidos</text>

        <!-- Thermal system tag -->
        <rect x="18" y="148" width="124" height="24" rx="3" fill="#1e293b" stroke="#0284c7" stroke-width="1" />
        <text x="80" y="160" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">❄️ Liquid Cooling Chiller</text>
        <text x="80" y="169" fill="#94a3b8" font-size="6.5" text-anchor="middle">Delta T &lt; 2.5°C entre células</text>
      </g>

      <!-- DC BUS LINE (Red) -->
      <line x1="175" y1="120" x2="225" y2="120" stroke="#ef4444" stroke-width="3" />
      <text x="200" y="112" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle">BARRAMENTO DC</text>
      <text x="200" y="132" fill="#94a3b8" font-size="7" text-anchor="middle">1.000V - 1.500V</text>

      <!-- SECTION 2: PCS INVERTERS -->
      <g transform="translate(225, 45)">
        <rect x="0" y="0" width="130" height="150" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
        <rect x="6" y="6" width="118" height="20" rx="3" fill="#4338ca" />
        <text x="65" y="20" fill="#e0e7ff" font-size="8.5" font-weight="bold" text-anchor="middle">PCS CONVERSOR (AC/DC)</text>

        <!-- Inverter Icon / Bridge -->
        <g transform="translate(20, 36)">
          <rect x="0" y="0" width="90" height="55" rx="3" fill="#0f172a" stroke="#818cf8" stroke-width="1" />
          <line x1="0" y1="55" x2="90" y2="0" stroke="#6366f1" stroke-width="1" />
          <text x="22" y="24" fill="#ef4444" font-size="9" font-weight="bold">=</text>
          <text x="22" y="34" fill="#94a3b8" font-size="7">DC</text>
          <text x="65" y="42" fill="#38bdf8" font-size="9" font-weight="bold">~</text>
          <text x="65" y="50" fill="#94a3b8" font-size="7">AC</text>
        </g>

        <!-- PCS Specs -->
        <text x="65" y="108" fill="#c7d2fe" font-size="8" font-weight="bold" text-anchor="middle">${sizing.pcsInverterCount}x Módulos (${sizing.nominalPowerMw} MW)</text>
        <text x="65" y="120" fill="#a5b4fc" font-size="7" text-anchor="middle">4 Quadrantes (P/Q Ativo e Reativo)</text>
        <text x="65" y="132" fill="#818cf8" font-size="7" text-anchor="middle">Grid-Forming / Resposta &lt; 20ms</text>
        <text x="65" y="144" fill="#94a3b8" font-size="6.5" text-anchor="middle">Filtro LCL (THD-I &lt; 3%)</text>
      </g>

      <!-- LOW VOLTAGE AC BUS (0.8 kV) -->
      <line x1="355" y1="120" x2="415" y2="120" stroke="#f59e0b" stroke-width="3" />
      <text x="385" y="112" fill="#fcd34d" font-size="7.5" font-weight="bold" text-anchor="middle">BT 0.8 kV AC</text>
      <text x="385" y="132" fill="#94a3b8" font-size="7" text-anchor="middle">3F 60Hz</text>

      <!-- SECTION 3: STEP-UP TRANSFORMER SKID -->
      <g transform="translate(415, 45)">
        <rect x="0" y="0" width="130" height="150" rx="6" fill="#291e0a" stroke="#f59e0b" stroke-width="1.5" />
        <rect x="6" y="6" width="118" height="20" rx="3" fill="#b45309" />
        <text x="65" y="20" fill="#fef3c7" font-size="8.5" font-weight="bold" text-anchor="middle">SKID TRANSFORMADOR</text>

        <!-- Trafo Interlocked Circles -->
        <g transform="translate(35, 38)">
          <circle cx="20" cy="28" r="18" fill="none" stroke="#f59e0b" stroke-width="2" />
          <circle cx="40" cy="28" r="18" fill="none" stroke="#38bdf8" stroke-width="2" />
          <text x="14" y="31" fill="#fcd34d" font-size="7" font-weight="bold">BT</text>
          <text x="36" y="31" fill="#7dd3fc" font-size="7" font-weight="bold">MT</text>
        </g>

        <!-- Trafo Specs -->
        <text x="65" y="105" fill="#fde68a" font-size="8" font-weight="bold" text-anchor="middle">${sizing.transformerRatingMva} MVA • Dyn1</text>
        <text x="65" y="117" fill="#fbbf24" font-size="7" text-anchor="middle">0.8 kV / ${voltage}</text>
        <text x="65" y="129" fill="#94a3b8" font-size="7" text-anchor="middle">Óleo Vegetal (Éster K, FR3)</text>
        <text x="65" y="141" fill="#94a3b8" font-size="6.5" text-anchor="middle">Válvula Alívio + Buchholz + PT100</text>
      </g>

      <!-- MEDIUM VOLTAGE LINE (13.8kV / 34.5kV) -->
      <line x1="545" y1="120" x2="605" y2="120" stroke="#38bdf8" stroke-width="3" />
      <text x="575" y="112" fill="#7dd3fc" font-size="7.5" font-weight="bold" text-anchor="middle">MT ${voltage}</text>
      <text x="575" y="132" fill="#94a3b8" font-size="7" text-anchor="middle">Trifásico</text>

      <!-- SECTION 4: MT PROTECTION CUBICLE & PAC -->
      <g transform="translate(605, 30)">
        <rect x="0" y="0" width="145" height="175" rx="6" fill="#111827" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="6" y="6" width="133" height="20" rx="3" fill="#0369a1" />
        <text x="72" y="20" fill="#f0f9ff" font-size="8.5" font-weight="bold" text-anchor="middle">CUBÍCULO MT & PROTEÇÃO</text>

        <!-- Breaker / Relay Symbol -->
        <g transform="translate(18, 35)">
          <rect x="0" y="0" width="109" height="35" rx="3" fill="#1e293b" stroke="#0ea5e9" stroke-width="1" />
          <text x="54" y="14" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">DISJUNTOR A VÁCUO (VCB)</text>
          <text x="54" y="26" fill="#94a3b8" font-size="7" text-anchor="middle">630A • 16kA Simétrico</text>
        </g>

        <!-- Relay functions ANSI list -->
        <rect x="18" y="76" width="109" height="52" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1" />
        <text x="54" y="88" fill="#f8fafc" font-size="7.5" font-weight="bold" text-anchor="middle">RELÉ DIGITAL (SEL/ABB)</text>
        <text x="54" y="99" fill="#cbd5e1" font-size="7" text-anchor="middle">ANSI 50/51/50N/51N (Sobrecorrente)</text>
        <text x="54" y="109" fill="#cbd5e1" font-size="7" text-anchor="middle">ANSI 27/59 (Tensão) • 81U/O (Freq)</text>
        <text x="54" y="119" fill="#34d399" font-size="7" text-anchor="middle">ANSI 67, 32 (Anti-ilhamento Ativo)</text>

        <!-- Metering -->
        <rect x="18" y="133" width="109" height="30" rx="3" fill="#1e293b" stroke="#34d399" stroke-width="1" />
        <text x="54" y="145" fill="#a7f3d0" font-size="7" font-weight="bold" text-anchor="middle">MEDIÇÃO FISCAL CCEE / DISTR.</text>
        <text x="54" y="155" fill="#94a3b8" font-size="6.5" text-anchor="middle">TCs e TPs Classe 0.2s Bidirecional</text>
      </g>

      <!-- INTERCONNECTION TO GRID AND CRITICAL LOAD -->
      <line x1="750" y1="120" x2="790" y2="120" stroke="#38bdf8" stroke-width="3" />
      
      <!-- Split to Grid and Critical Plant Bus -->
      <path d="M 790 120 L 810 70 L 870 70" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)" />
      <path d="M 790 120 L 810 170 L 870 170" fill="none" stroke="#34d399" stroke-width="2" marker-end="url(#arrowGreen)" />
      
      <!-- Destination labels -->
      <g transform="translate(805, 52)">
        <rect x="0" y="0" width="70" height="32" rx="3" fill="#0369a1" />
        <text x="35" y="13" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">REDE DA</text>
        <text x="35" y="24" fill="#e0f2fe" font-size="7" text-anchor="middle">${client.utilityCompany.split(' ')[0]}</text>
      </g>

      <g transform="translate(805, 154)">
        <rect x="0" y="0" width="70" height="32" rx="3" fill="#065f46" />
        <text x="35" y="13" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">CARGA DA</text>
        <text x="35" y="24" fill="#ecfdf5" font-size="7" text-anchor="middle">FÁBRICA (${client.contractedDemandKw}kW)</text>
      </g>
    </svg>
    <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 6px; display: flex; justify-content: space-between;">
      <span>Legenda: <strong style="color: #ef4444;">— DC (1500V)</strong> | <strong style="color: #f59e0b;">— BT AC (0.8kV)</strong> | <strong style="color: #38bdf8;">— MT AC (${voltage})</strong></span>
      <span>Certificações: UL 9540A, NFPA 855, IEC 62619, NBR 14039</span>
    </div>
  </div>`;
}

/**
 * 2. LAYOUT MECÂNICO CONCEITUAL & ARRANJO FÍSICO DO SÍTIO (BOP & Civil)
 * Mostra a vista superior de engenharia do pátio: radier dos contêineres, afastamento NFPA 855 de 3m,
 * bacia de contenção do trafo, rota de fuga, hidrante/extintores, trincheiras de cabos MT/BT e perímetro.
 */
export function renderMechanicalLayoutSvg(cfg: DiagramConfig): string {
  const { sizing, vendor } = cfg;
  const numContainers = Math.max(1, Math.min(sizing.batteryContainersCount, 4));

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0f172a; border-radius: 8px; padding: 10px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px; font-size: 8.5pt;">
      <span style="font-weight: 700; color: #38bdf8; letter-spacing: 0.5px;">🏗️ LAYOUT MECÂNICO & ARRANJO ESPACIAL DO PÁTIO BESS (BOP CIVIL)</span>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Footprint: ~${sizing.batteryContainersCount * 38 + 55} m² • Conforme NFPA 855 & NBR 6118</span>
    </div>
    <svg viewBox="0 0 880 220" style="width: 100%; height: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px;">
      <!-- Grid -->
      <rect width="880" height="220" fill="#0b1329" rx="6" />

      <!-- FENCE / PERIMETER -->
      <rect x="20" y="15" width="840" height="190" rx="4" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="6,4" />
      <text x="440" y="28" fill="#64748b" font-size="8" font-weight="bold" text-anchor="middle">ALAMBRADO PERIMETRAL DE SEGURANÇA (AFASTAMENTO REGULAMENTAR &gt; 3.0m NFPA 855)</text>

      <!-- ACCESS ROAD -->
      <rect x="25" y="170" width="830" height="30" fill="#1e293b" />
      <text x="440" y="188" fill="#94a3b8" font-size="8" font-weight="bold" text-anchor="middle">VIA PAVIMENTADA PARA ACESSO DE GUINDASTE, MANUTENÇÃO & VIATURAS DE BOMBEIROS (LARGURA 4.5m)</text>

      <!-- CONCRETE RADIER SLAB -->
      <rect x="40" y="40" width="530" height="115" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1" />
      <text x="50" y="52" fill="#94a3b8" font-size="7.5" font-weight="bold">RADIER DE CONCRETO ARMADO (30cm - FCK 30MPa - MALHA DE ATERRAMENTO &lt; 5Ω)</text>

      <!-- BATTERY CONTAINERS (Dynamic based on count) -->
      ${Array.from({ length: numContainers })
        .map((_, i) => {
          const x = 55 + i * 125;
          return `
          <g transform="translate(${x}, 58)">
            <!-- Container Box 20ft / 40ft equivalent -->
            <rect x="0" y="0" width="105" height="85" rx="3" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
            <!-- Roof / corrugated top -->
            <rect x="5" y="5" width="95" height="14" rx="2" fill="#047857" />
            <text x="52" y="15" fill="#ecfdf5" font-size="7" font-weight="bold" text-anchor="middle">CONTÊINER BESS #${i + 1}</text>
            
            <!-- Interior layout representation -->
            <text x="52" y="32" fill="#a7f3d0" font-size="6.5" text-anchor="middle">${vendor.vendorName} (${vendor.productLine.split('(')[0]})</text>
            
            <!-- Racks indicator -->
            <rect x="10" y="38" width="85" height="18" rx="1" fill="#0f172a" stroke="#059669" stroke-width="0.5" />
            <text x="52" y="50" fill="#34d399" font-size="6.5" text-anchor="middle">RACKS LFP 314Ah (1500V DC)</text>

            <!-- HVAC / Liquid chiller block on container rear -->
            <rect x="10" y="60" width="40" height="18" rx="1" fill="#0284c7" />
            <text x="30" y="72" fill="#e0f2fe" font-size="6" font-weight="bold" text-anchor="middle">CHILLER</text>

            <!-- Fire suppression clean agent tank -->
            <rect x="55" y="60" width="40" height="18" rx="1" fill="#dc2626" />
            <text x="75" y="72" fill="#fef2f2" font-size="6" font-weight="bold" text-anchor="middle">FK-5-1-12</text>
          </g>
          <!-- Spacing indicator between containers -->
          ${i < numContainers - 1 ? `
            <line x1="${x + 105}" y1="100" x2="${x + 125}" y2="100" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="${x + 115}" y="95" fill="#f59e0b" font-size="6" font-weight="bold" text-anchor="middle">3m</text>
          ` : ''}
          `;
        })
        .join('')}

      <!-- CABLE TRENCH (Trincheira de cabos) -->
      <rect x="40" y="148" width="790" height="10" fill="#334155" stroke="#475569" stroke-width="0.5" />
      <text x="435" y="156" fill="#cbd5e1" font-size="6.5" font-weight="bold" text-anchor="middle">TRINCHEIRA DE CABOS BLINDADA MT/BT/FIBRA ÓPTICA (SEPARADA COM SEPTO FÍSICO)</text>

      <!-- SECTION 2: TRANSFORMER & PCS SKID -->
      <g transform="translate(590, 40)">
        <!-- Oil containment basin (Dique de contenção) -->
        <rect x="0" y="0" width="240" height="105" rx="4" fill="#1e293b" stroke="#d97706" stroke-width="1.5" />
        <text x="120" y="14" fill="#fbbf24" font-size="7.5" font-weight="bold" text-anchor="middle">SUBESTAÇÃO SKID & BACIA DE CONTENÇÃO ÓLEO</text>

        <!-- PCS Inverter Skid -->
        <rect x="15" y="24" width="95" height="70" rx="3" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
        <text x="62" y="38" fill="#e0e7ff" font-size="7" font-weight="bold" text-anchor="middle">SKID PCS CONVERSOR</text>
        <text x="62" y="52" fill="#c7d2fe" font-size="6.5" text-anchor="middle">${sizing.pcsInverterCount}x Módulos Inversores</text>
        <text x="62" y="65" fill="#a5b4fc" font-size="6.5" text-anchor="middle">0.8 kV AC • IP55</text>
        <text x="62" y="78" fill="#818cf8" font-size="6" text-anchor="middle">Quadro AC Integrado</text>

        <!-- Step-up Transformer Skid -->
        <rect x="125" y="24" width="100" height="70" rx="3" fill="#3b2606" stroke="#f59e0b" stroke-width="1" />
        <text x="175" y="38" fill="#fef3c7" font-size="7" font-weight="bold" text-anchor="middle">TRAFO ELEVADOR MT</text>
        <text x="175" y="52" fill="#fde68a" font-size="6.5" text-anchor="middle">${sizing.transformerRatingMva} MVA • 0.8kV / MT</text>
        <text x="175" y="65" fill="#f59e0b" font-size="6.5" text-anchor="middle">Dique c/ Separador Água/Óleo</text>
        <text x="175" y="78" fill="#d97706" font-size="6" text-anchor="middle">Óleo Vegetal Éster K</text>
      </g>

      <!-- SAFETY & FIRE EXTINGUISHER / HYDRANT ICONS -->
      <g transform="translate(30, 70)">
        <circle cx="0" cy="0" r="6" fill="#dc2626" />
        <text x="0" y="3" fill="#fff" font-size="6" font-weight="bold" text-anchor="middle">H</text>
      </g>
      <text x="30" y="85" fill="#ef4444" font-size="6" font-weight="bold" text-anchor="middle">HIDRANTE</text>

      <g transform="translate(850, 70)">
        <circle cx="0" cy="0" r="6" fill="#dc2626" />
        <text x="0" y="3" fill="#fff" font-size="6" font-weight="bold" text-anchor="middle">H</text>
      </g>
      <text x="850" y="85" fill="#ef4444" font-size="6" font-weight="bold" text-anchor="middle">HIDRANTE</text>
    </svg>
    <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 6px; display: flex; justify-content: space-between;">
      <span>Dimensões de referência do contêiner 20ft: 6.05m x 2.44m x 2.89m • Peso unitário ~32 toneladas</span>
      <span>Normas aplicadas: NFPA 855 (Energy Storage Systems), ABNT NBR 6118, Instrução Técnica Bombeiros IT-45</span>
    </div>
  </div>`;
}

/**
 * 3. GRÁFICO CONCEITUAL DE DESPACHO DIÁRIO 24 HORAS (PEAK SHAVING & ARBITRAGEM)
 * Mostra a curva de carga da fábrica ao longo das 24h:
 * - Madrugada: recarga em fora de ponta a baixo custo
 * - Dia: consumo solar / operação fabril normal
 * - Ponta (18h-21h): injeção BESS zerando a demanda e o consumo de ponta caro
 */
export function renderDailyDispatchChartSvg(cfg: DiagramConfig): string {
  const { client, input, sizing } = cfg;

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0f172a; border-radius: 8px; padding: 10px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px; font-size: 8.5pt;">
      <span style="font-weight: 700; color: #fbbf24; letter-spacing: 0.5px;">📈 GRÁFICO OPERACIONAL: CURVA DE DESPACHO DIÁRIO DO BESS (24 HORAS)</span>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Estratégia: Carga na Madrugada / Descarga na Ponta (18h-21h)</span>
    </div>
    <svg viewBox="0 0 880 210" style="width: 100%; height: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px;">
      <rect width="880" height="210" fill="#0b1329" rx="6" />

      <!-- X and Y Axes -->
      <!-- Horas 0h -> 24h -->
      <!-- X: 70 to 830 (760px total / 24 hours = 31.6px/hour) -->
      <!-- Y: 30 to 170 (140px height) -->
      <line x1="70" y1="170" x2="840" y2="170" stroke="#475569" stroke-width="1" />
      <line x1="70" y1="30" x2="70" y2="170" stroke="#475569" stroke-width="1" />

      <!-- Y Axis grid and labels -->
      <line x1="70" y1="135" x2="840" y2="135" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="138" fill="#64748b" font-size="7.5" text-anchor="end">${(client.contractedDemandKw * 0.33).toFixed(0)} kW</text>

      <line x1="70" y1="100" x2="840" y2="100" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="103" fill="#64748b" font-size="7.5" text-anchor="end">${(client.contractedDemandKw * 0.66).toFixed(0)} kW</text>

      <line x1="70" y1="65" x2="840" y2="65" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="68" fill="#64748b" font-size="7.5" text-anchor="end">${client.contractedDemandKw} kW (Contratado)</text>

      <!-- Highlighted PEAK ZONE (18h to 21h): X = 70 + 18*31.6 = 638 to 70 + 21*31.6 = 733 -->
      <rect x="638" y="30" width="95" height="140" fill="#ef4444" fill-opacity="0.12" />
      <line x1="638" y1="30" x2="638" y2="170" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3" />
      <line x1="733" y1="30" x2="733" y2="170" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3" />
      <text x="685" y="42" fill="#f87171" font-size="8" font-weight="bold" text-anchor="middle">POSTO DE PONTA (18h-21h)</text>
      <text x="685" y="53" fill="#fca5a5" font-size="7" text-anchor="middle">Tarifa R$ ${client.peakTariff.toFixed(2)}/kWh</text>

      <!-- Highlighted CHARGE ZONE (0h to 6h): X = 70 to 70 + 6*31.6 = 259 -->
      <rect x="70" y="30" width="189" height="140" fill="#0284c7" fill-opacity="0.1" />
      <text x="164" y="42" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">RECARGA DO BESS (0h-6h)</text>
      <text x="164" y="53" fill="#7dd3fc" font-size="7" text-anchor="middle">Tarifa Fora de Ponta R$ ${client.offPeakTariff.toFixed(2)}/kWh</text>

      <!-- BASE LOAD PROFILE (Factory Load - Grey area/line) -->
      <!-- Path simulating daily consumption with evening peak -->
      <path d="M 70 145 Q 165 145 260 130 Q 350 85 450 80 Q 550 82 638 65 Q 685 58 733 65 Q 780 125 840 145" 
            fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3" />

      <!-- BESS DISCHARGE CUTTING THE PEAK (Green line - Net load after BESS) -->
      <path d="M 70 110 Q 165 110 260 130 Q 350 85 450 80 Q 550 82 638 120 Q 685 125 733 120 Q 780 125 840 145" 
            fill="none" stroke="#34d399" stroke-width="2.5" />

      <!-- Peak shaving shaded saving area -->
      <path d="M 638 65 Q 685 58 733 65 L 733 120 Q 685 125 638 120 Z" 
            fill="#34d399" fill-opacity="0.35" />
      <text x="685" y="90" fill="#34d399" font-size="8.5" font-weight="bold" text-anchor="middle">PEAK SHAVING</text>
      <text x="685" y="102" fill="#a7f3d0" font-size="7.5" font-weight="bold" text-anchor="middle">-${sizing.nominalPowerKw} kW Cortados</text>

      <!-- Charge area in early morning -->
      <path d="M 70 145 Q 165 145 260 130 L 260 130 Q 165 110 70 110 Z" 
            fill="#38bdf8" fill-opacity="0.3" />
      <text x="164" y="125" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">+ Recarga (${sizing.nominalPowerKw} kW)</text>

      <!-- X Axis Hour ticks -->
      ${[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
        .map((hr) => {
          const x = 70 + (hr / 24) * 770;
          return `
          <line x1="${x}" y1="170" x2="${x}" y2="175" stroke="#64748b" stroke-width="1" />
          <text x="${x}" y="185" fill="#94a3b8" font-size="7" text-anchor="middle">${hr}h</text>
        `;
        })
        .join('')}

      <!-- LEGEND -->
      <g transform="translate(180, 195)">
        <line x1="0" y1="5" x2="20" y2="5" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3" />
        <text x="25" y="8" fill="#94a3b8" font-size="7.5">Consumo Bruto da Fábrica (Sem BESS)</text>

        <line x1="220" y1="5" x2="240" y2="5" stroke="#34d399" stroke-width="2.5" />
        <text x="245" y="8" fill="#34d399" font-size="7.5" font-weight="bold">Perfil Líquido com BESS Despachado</text>

        <rect x="440" y="0" width="10" height="10" fill="#34d399" fill-opacity="0.5" />
        <text x="455" y="8" fill="#a7f3d0" font-size="7.5">Energia Descarregada no Pico (R$ ${(sizing.annualPeakShavingSavingsBrl / 1000).toLocaleString('pt-BR')}k/ano economizados)</text>
      </g>
    </svg>
  </div>`;
}

/**
 * 4. GRÁFICO CONCEITUAL DE DEGRADAÇÃO E RETENÇÃO DE CAPACIDADE (15 ANOS)
 * Compara a retenção de capacidade (%) ao longo dos anos para o sistema LFP com Liquid Cooling
 * versus sistema convencional com Air Cooling e o limiar de garantia de fábrica (70% - 80%).
 */
export function renderBatteryDegradationChartSvg(cfg: DiagramConfig): string {
  const { input, vendor } = cfg;

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0f172a; border-radius: 8px; padding: 10px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px; font-size: 8.5pt;">
      <span style="font-weight: 700; color: #a7f3d0; letter-spacing: 0.5px;">📉 CURVA DE DEGRADAÇÃO & RETENÇÃO DE CAPACIDADE DA BATERIA (15 ANOS)</span>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Garantia de ${vendor.warrantyYears} anos • ${vendor.guaranteedCycles.toLocaleString('pt-BR')} ciclos garantidos</span>
    </div>
    <svg viewBox="0 0 880 190" style="width: 100%; height: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px;">
      <rect width="880" height="190" fill="#0b1329" rx="6" />

      <!-- Axes -->
      <!-- X: 70 to 830 (15 years) -->
      <!-- Y: 30 to 150 (60% to 100% capacity) -->
      <line x1="70" y1="150" x2="830" y2="150" stroke="#475569" stroke-width="1" />
      <line x1="70" y1="30" x2="70" y2="150" stroke="#475569" stroke-width="1" />

      <!-- Horizontal grid lines -->
      <line x1="70" y1="30" x2="830" y2="30" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="33" fill="#64748b" font-size="7.5" text-anchor="end">100% SOH</text>

      <line x1="70" y1="60" x2="830" y2="60" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="63" fill="#64748b" font-size="7.5" text-anchor="end">90% SOH</text>

      <line x1="70" y1="90" x2="830" y2="90" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
      <text x="62" y="93" fill="#64748b" font-size="7.5" text-anchor="end">80% SOH</text>

      <!-- 70% End of Warranty line -->
      <line x1="70" y1="120" x2="830" y2="120" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,2" />
      <text x="62" y="123" fill="#ef4444" font-size="7.5" font-weight="bold" text-anchor="end">70% (EOL)</text>
      <text x="825" y="117" fill="#ef4444" font-size="7" font-weight="bold" text-anchor="end">Limiar de Fim de Vida Útil Contratual (EOL)</text>

      <!-- Year ticks 0 to 15 -->
      ${Array.from({ length: 16 })
        .map((_, yr) => {
          const x = 70 + (yr / 15) * 750;
          return `
          <line x1="${x}" y1="150" x2="${x}" y2="154" stroke="#64748b" stroke-width="1" />
          <text x="${x}" y="164" fill="#94a3b8" font-size="7" text-anchor="middle">Ano ${yr}</text>
        `;
        })
        .join('')}

      <!-- Proposed Liquid Cooling Curve (Emerald Line) -->
      <!-- Year 0: 100%, Year 1: 97%, Year 5: 90%, Year 10: 82%, Year 15: 76% -->
      <!-- Y calculation: Y = 30 + (100 - SOH) * 3 -->
      <path d="M 70 30 Q 120 40 220 54 Q 420 75 570 93 Q 700 108 820 114" 
            fill="none" stroke="#10b981" stroke-width="3" />
      
      <!-- Dots on Liquid Cooling -->
      <circle cx="70" cy="30" r="4" fill="#10b981" />
      <circle cx="320" cy="65" r="4" fill="#10b981" />
      <text x="320" y="58" fill="#34d399" font-size="7" font-weight="bold" text-anchor="middle">Ano 5 (88.3%)</text>
      <circle cx="570" cy="93" r="4" fill="#10b981" />
      <text x="570" y="86" fill="#34d399" font-size="7" font-weight="bold" text-anchor="middle">Ano 10 (79.0%)</text>
      <circle cx="820" cy="114" r="4" fill="#10b981" />
      <text x="820" y="106" fill="#34d399" font-size="7.5" font-weight="bold" text-anchor="middle">Ano 15 (75.3%)</text>

      <!-- Conventional Air Cooling Curve (Orange Dash - higher degradation) -->
      <path d="M 70 30 Q 120 48 220 68 Q 420 100 570 122 Q 680 138 820 146" 
            fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" />
      <circle cx="570" cy="122" r="3" fill="#f59e0b" />
      <text x="570" y="132" fill="#fbbf24" font-size="6.5" text-anchor="middle">Ar Convencional: 69.3% no Ano 10</text>

      <!-- Legend -->
      <g transform="translate(180, 177)">
        <line x1="0" y1="5" x2="25" y2="5" stroke="#10b981" stroke-width="3" />
        <text x="30" y="8" fill="#34d399" font-size="7.5" font-weight="bold">Solução Proposta com Liquid Cooling (${vendor.vendorName}) - Taxa ${input.annualDegradationPercent}%/ano</text>

        <line x1="420" y1="5" x2="445" y2="5" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" />
        <text x="450" y="8" fill="#fbbf24" font-size="7.5">Sistema Básico com Air Cooling (Degradação precoce por gradiente térmico)</text>
      </g>
    </svg>
  </div>`;
}

/**
 * 5. ESQUEMA MECÂNICO & TÉRMICO DO SISTEMA DE LIQUID COOLING
 * Mostra o circuito fechado de fluido térmico (água/glicol 50-50), microcanais entre células LFP,
 * bomba de circulação, chiller exterior de alta eficiência e controle de ponto de orvalho (dew point).
 */
export function renderLiquidCoolingSchematicSvg(cfg: DiagramConfig): string {
  const { vendor } = cfg;

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0f172a; border-radius: 8px; padding: 10px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px; font-size: 8.5pt;">
      <span style="font-weight: 700; color: #38bdf8; letter-spacing: 0.5px;">❄️ ESQUEMA TÉRMICO & MECÂNICO: SISTEMA DE LIQUID COOLING EM CIRCUITO FECHADO</span>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Tecnologia: ${vendor.coolingMethod} • Delta T &lt; 2.5°C</span>
    </div>
    <svg viewBox="0 0 880 190" style="width: 100%; height: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px;">
      <rect width="880" height="190" fill="#0b1329" rx="6" />

      <!-- EXTERIOR UNIT: CHILLER & COMPRESSOR -->
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="180" height="140" rx="6" fill="#132a4a" stroke="#0284c7" stroke-width="1.5" />
        <rect x="8" y="8" width="164" height="20" rx="3" fill="#0369a1" />
        <text x="90" y="22" fill="#f0f9ff" font-size="8.5" font-weight="bold" text-anchor="middle">UNIDADE CHILLER EXTERNA</text>

        <!-- Compressor and Heat Exchanger -->
        <rect x="15" y="38" width="70" height="42" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <text x="50" y="55" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">COMPRESSOR</text>
        <text x="50" y="67" fill="#94a3b8" font-size="6.5" text-anchor="middle">Inverter VFD</text>

        <rect x="95" y="38" width="70" height="42" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
        <text x="130" y="55" fill="#38bdf8" font-size="7.5" font-weight="bold" text-anchor="middle">VENTILADOR</text>
        <text x="130" y="67" fill="#94a3b8" font-size="6.5" text-anchor="middle">EC Axial</text>

        <!-- Circulation Pump -->
        <rect x="15" y="90" width="150" height="38" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="1" />
        <text x="90" y="105" fill="#34d399" font-size="7.5" font-weight="bold" text-anchor="middle">BOMBA DUPLA DE CIRCULAÇÃO (1+1 REDUNDANTE)</text>
        <text x="90" y="117" fill="#94a3b8" font-size="6.5" text-anchor="middle">Fluido Térmico: Água + Etilenoglicol 50/50</text>
      </g>

      <!-- SUPPLY LINE (Cold Blue Line) -->
      <path d="M 210 50 L 320 50" fill="none" stroke="#38bdf8" stroke-width="3" />
      <text x="265" y="42" fill="#7dd3fc" font-size="7.5" font-weight="bold" text-anchor="middle">IDA: FLUIDO FRIO (18°C)</text>

      <!-- RETURN LINE (Warm Red/Orange Line) -->
      <path d="M 320 140 L 210 140" fill="none" stroke="#f97316" stroke-width="3" />
      <text x="265" y="152" fill="#fdba74" font-size="7.5" font-weight="bold" text-anchor="middle">VOLTA: FLUIDO AQUECIDO (24°C)</text>

      <!-- BATTERY CONTAINER INTERIOR (Placas Frias e Racks) -->
      <g transform="translate(320, 20)">
        <rect x="0" y="0" width="530" height="150" rx="6" fill="#132338" stroke="#10b981" stroke-width="1.5" />
        <rect x="8" y="8" width="514" height="20" rx="3" fill="#065f46" />
        <text x="265" y="22" fill="#ecfdf5" font-size="8.5" font-weight="bold" text-anchor="middle">INTERIOR DO CONTÊINER: DISTRIBUIÇÃO POR PLACAS FRIAS DE MICROCANAL</text>

        <!-- Racks 1, 2, 3 with cold plates -->
        ${[0, 1, 2, 3]
          .map((idx) => {
            const rx = 20 + idx * 125;
            return `
            <g transform="translate(${rx}, 38)">
              <!-- Rack frame -->
              <rect x="0" y="0" width="105" height="98" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1" />
              <text x="52" y="14" fill="#a7f3d0" font-size="7" font-weight="bold" text-anchor="middle">MÓDULO BATERIA #${idx + 1}</text>
              
              <!-- Prismatic cells -->
              <rect x="10" y="20" width="85" height="42" rx="2" fill="#1e293b" stroke="#059669" stroke-width="0.5" />
              <text x="52" y="36" fill="#34d399" font-size="7" text-anchor="middle">Células LFP 314Ah</text>
              <text x="52" y="48" fill="#94a3b8" font-size="6" text-anchor="middle">T_célula: 22.1°C ± 1.2°C</text>

              <!-- Cold plate microchannels underneath -->
              <rect x="10" y="66" width="85" height="12" rx="1" fill="#0284c7" />
              <text x="52" y="75" fill="#f0f9ff" font-size="6" font-weight="bold" text-anchor="middle">PLACA FRIA DE ALUMÍNIO</text>

              <!-- Sensors -->
              <text x="52" y="90" fill="#f59e0b" font-size="6" text-anchor="middle">32x Sensores NTC/Módulo</text>
            </g>
          `;
          })
          .join('')}
      </g>
    </svg>
    <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 6px; display: flex; justify-content: space-between;">
      <span>Vantagem do Liquid Cooling: Redução do consumo auxiliar (parasítico) em até 35% e aumento de vida útil em 25%.</span>
      <span>Proteção contra condensação: Controle inteligente com monitoramento de ponto de orvalho (dew-point) pelo BMS.</span>
    </div>
  </div>`;
}

/**
 * 6. QUADRO RESUMO COMPARATIVO BRASIL — FABRICANTES HOMOLOGADOS
 * Apresenta o benchmark comercial e técnico consolidado dos 5 fabricantes líderes no Brasil:
 * Huawei, Sungrow, BYD, WEG e Tesla, com destaque para a solução homologada.
 */
export function renderBrazilVendorsComparisonSummarySvg(cfg: DiagramConfig): string {
  const { client, sizing, vendor } = cfg;
  const projectMwh = sizing.nominalEnergyMwh;

  const vendorsSummary = [
    {
      id: 'huawei',
      name: 'Huawei Digital Power',
      product: 'Smart String LUNA2000',
      flag: '🇨🇳 / 🇧🇷',
      capexPerKwh: 1650,
      finame: 'Importação (Bancos Privados / ESG)',
      finameColor: '#94a3b8',
      warranty: '10 anos (6.800 ciclos)',
      rte: '91.5%',
      architecture: 'Smart String Descentralizado',
      cooling: 'Liquid Cooling Inteligente',
      sla: 'SLA 24-48h • Louveira/Sorocaba (SP)',
      rating: '4.9 / 5.0',
    },
    {
      id: 'sungrow',
      name: 'Sungrow Power Supply',
      product: 'PowerTitan Series',
      flag: '🇨🇳 / 🇧🇷',
      capexPerKwh: 1520,
      finame: 'Importação (Bancos Privados)',
      finameColor: '#94a3b8',
      warranty: '10 anos (6.500 ciclos)',
      rte: '91.0%',
      architecture: 'Centralizado Integrado',
      cooling: 'Liquid Cooling Inteligente',
      sla: 'SLA 48h • SP, MG e Nordeste',
      rating: '4.8 / 5.0',
    },
    {
      id: 'byd',
      name: 'BYD Energy Brasil',
      product: 'MC Cube ESS (Blade CTP)',
      flag: '🇨🇳 / 🇧🇷',
      capexPerKwh: 1580,
      finame: 'Parcial / Em processo BNDES',
      finameColor: '#fbbf24',
      warranty: '10 anos (7.000 ciclos)',
      rte: '90.5%',
      architecture: 'Blade CTP Modular',
      cooling: 'Liquid Microcanal',
      sla: 'Fabril BR • Campinas/Camaçari',
      rating: '4.7 / 5.0',
    },
    {
      id: 'weg',
      name: 'WEG Equipamentos Elétricos',
      product: 'WEG W-ESS Integrado',
      flag: '🇧🇷',
      capexPerKwh: 1780,
      finame: '100% ELEGÍVEL FINAME BNDES',
      finameColor: '#34d399',
      warranty: '10 anos (6.000 ciclos)',
      rte: '89.5%',
      architecture: 'Industrial Nacionalizado',
      cooling: 'Líquido / Ar Híbrido',
      sla: 'Líder Absoluto • Todos os municípios',
      rating: '4.7 / 5.0',
    },
    {
      id: 'tesla',
      name: 'Tesla Energy',
      product: 'Megapack 2XL Series',
      flag: '🇺🇸 / 🇧🇷',
      capexPerKwh: 1850,
      finame: 'Importação Direta (US$ Ex-Tarifário)',
      finameColor: '#94a3b8',
      warranty: '15 anos (7.500 ciclos)',
      rte: '92.0%',
      architecture: 'Centralizado Integrado',
      cooling: 'Liquid Cooling Inteligente',
      sla: 'SLA Remoto 24/7 + Integrador local',
      rating: '4.6 / 5.0',
    },
  ];

  return `
  <div class="diagram-card" style="margin: 10px 0; background: #0b1329; border-radius: 8px; padding: 12px; color: #f8fafc; border: 1px solid #1e293b; page-break-inside: avoid;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 10px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; font-size: 8.5pt; color: #34d399; letter-spacing: 0.5px;">📊 RESUMO COMPARATIVO BRASIL — FABRICANTES HOMOLOGADOS</span>
        <span style="background: #065f46; color: #a7f3d0; font-size: 7pt; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PANORAMA MULTICRITÉRIO</span>
      </div>
      <span style="font-size: 7.5pt; color: #94a3b8; font-family: monospace;">Planta: ${sizing.nominalPowerMw} MW / ${sizing.nominalEnergyMwh} MWh (${client.clientName})</span>
    </div>

    <!-- Comparative Table -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <thead>
          <tr style="background: #1e293b; color: #94a3b8; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.5px;">
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155;">Fabricante & Linha</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155;">Arquitetura / Resfr.</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155; text-align: center;">RTE</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155;">Garantia & Ciclos</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155; text-align: right;">Capex / kWh</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155; text-align: right;">Capex Projeto</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155;">FINAME / BNDES</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155;">Suporte Local BR</th>
            <th style="padding: 6px 8px; border-bottom: 1px solid #334155; text-align: center;">Score</th>
          </tr>
        </thead>
        <tbody>
          ${vendorsSummary
            .map((v) => {
              const isSelected = v.id === vendor.id;
              const estTurnkeyBrl = (v.capexPerKwh * projectMwh * 1000 * 1.34) / 1_000_000;
              const bg = isSelected ? 'background: rgba(16, 185, 129, 0.12);' : '';
              const border = isSelected ? 'border-left: 3px solid #10b981;' : 'border-left: 3px solid transparent;';

              return `
              <tr style="${bg} ${border} border-bottom: 1px solid #1e293b;">
                <td style="padding: 7px 8px;">
                  <div style="font-weight: 700; color: ${isSelected ? '#34d399' : '#f8fafc'}; display: flex; align-items: center; gap: 4px;">
                    <span>${v.flag}</span>
                    <span>${v.name}</span>
                    ${isSelected ? '<span style="background: #10b981; color: #022c22; font-size: 6pt; font-weight: 800; padding: 1px 4px; border-radius: 3px; margin-left: 4px;">RECOMENDADO</span>' : ''}
                  </div>
                  <div style="font-size: 6.5pt; color: #94a3b8;">${v.product}</div>
                </td>
                <td style="padding: 7px 8px; color: #cbd5e1;">
                  <div>${v.architecture}</div>
                  <div style="font-size: 6.5pt; color: #64748b;">${v.cooling}</div>
                </td>
                <td style="padding: 7px 8px; text-align: center; font-weight: 700; color: #38bdf8;">${v.rte}</td>
                <td style="padding: 7px 8px; color: #cbd5e1;">${v.warranty}</td>
                <td style="padding: 7px 8px; text-align: right; font-weight: 700; font-family: monospace; color: #f1f5f9;">
                  R$ ${v.capexPerKwh.toLocaleString('pt-BR')}
                </td>
                <td style="padding: 7px 8px; text-align: right; font-weight: 800; font-family: monospace; color: ${isSelected ? '#34d399' : '#e2e8f0'};">
                  R$ ${estTurnkeyBrl.toFixed(2)} M
                </td>
                <td style="padding: 7px 8px; color: ${v.finameColor}; font-weight: 600; font-size: 7pt;">${v.finame}</td>
                <td style="padding: 7px 8px; color: #94a3b8; font-size: 6.8pt;">${v.sla}</td>
                <td style="padding: 7px 8px; text-align: center; font-weight: 800; color: #fbbf24;">⭐ ${v.rating}</td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>

    <!-- Summary Footnote -->
    <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; font-size: 7pt; color: #94a3b8;">
      <span><strong>Solução Homologada:</strong> ${vendor.vendorName} (${vendor.productLine}) • Menor LCOS e melhor adequação técnica às cargas de ${client.clientName}.</span>
      <span style="color: #64748b;">Preços parametrizados com base nos relatórios de inteligência de mercado Allmera Q1/2026.</span>
    </div>
  </div>`;
}

