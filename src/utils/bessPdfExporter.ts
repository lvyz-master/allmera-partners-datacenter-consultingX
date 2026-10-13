import {
  BessClientProfile,
  BessSizingInput,
  BessSizingResult,
  BessVendorProduct,
} from '../types/bess';
import { DossierChapter } from '../data/bessDossierChapters';

interface ExportDossierOptions {
  client: BessClientProfile;
  input: BessSizingInput;
  sizing: BessSizingResult;
  vendor: BessVendorProduct;
  chapters: DossierChapter[];
  dossierRefCode: string;
  currentDate: string;
}

/**
 * Constrói o HTML puro autossuficiente e formatado para impressão A4 / PDF do Dossiê Completo
 */
import {
  renderSingleLineDiagramSvg,
  renderMechanicalLayoutSvg,
  renderDailyDispatchChartSvg,
  renderBatteryDegradationChartSvg,
  renderLiquidCoolingSchematicSvg,
  renderBrazilVendorsComparisonSummarySvg,
} from './bessDiagramGenerators';

export function buildDossierHtml(options: ExportDossierOptions): string {
  const { client, input, sizing, vendor, chapters, dossierRefCode, currentDate } = options;

  const totalPages = 34;

  const chaptersHtml = chapters
    .map((ch) => {
      // Determine if this chapter should feature a conceptual schematic or analytical chart
      let diagramHtml = '';
      const diagConfig = { client, input, sizing, vendor };
      
      const chNum = Number(ch.chapterNumber);
      if (chNum === 3) {
        // Peak Shaving chapter -> 24h Daily Dispatch operational curve
        diagramHtml = renderDailyDispatchChartSvg(diagConfig);
      } else if (chNum === 15) {
        // Electrochemical Sizing chapter -> 15-Year Degradation & Capacity Retention chart
        diagramHtml = renderBatteryDegradationChartSvg(diagConfig);
      } else if (chNum === 18) {
        // Thermal Management chapter -> Liquid Cooling closed-loop schematic
        diagramHtml = renderLiquidCoolingSchematicSvg(diagConfig);
      } else if (chNum === 21) {
        // BOP & Civil chapter -> Mechanical site layout & spatial arrangement
        diagramHtml = renderMechanicalLayoutSvg(diagConfig);
      } else if (chNum === 22) {
        // SLD & Substation chapter -> Single Line Diagram (SLD) electrical schematic
        diagramHtml = renderSingleLineDiagramSvg(diagConfig);
      } else if (chNum === 28 || chNum === 29) {
        // Commercial section -> Summary comparison of all Brazil BESS manufacturers
        diagramHtml = renderBrazilVendorsComparisonSummarySvg(diagConfig);
      }

      const metricsHtml = ch.keyMetrics
        ? `<div class="metrics-grid">
            ${ch.keyMetrics
              .map(
                (m) => `
              <div class="metric-card">
                <div class="metric-label">${m.label}</div>
                <div class="metric-value">${m.value}</div>
                ${m.hint ? `<div class="metric-hint">${m.hint}</div>` : ''}
              </div>`
              )
              .join('')}
          </div>`
        : '';

      const bulletsHtml = ch.bulletPoints
        ? `<ul class="bullets-list">
            ${ch.bulletPoints.map((b) => `<li>${b}</li>`).join('')}
          </ul>`
        : '';

      const detailsHtml = ch.technicalDetails
        ? `<div class="details-section">
            ${ch.technicalDetails
              .map(
                (d) => `
              <div class="detail-box">
                <div class="detail-title">${d.title}</div>
                <div class="detail-content">${d.content}</div>
              </div>`
              )
              .join('')}
          </div>`
        : '';

      const noteHtml = ch.recommendationNote
        ? `<div class="rec-note">
            <strong>Recomendação Técnica Allmera:</strong> ${ch.recommendationNote}
          </div>`
        : '';

      const normHtml = ch.regulatoryOrNormative
        ? `<div class="norm-badge">
            <span class="norm-label">Norma / Referência Aplicável:</span> ${ch.regulatoryOrNormative}
          </div>`
        : '';

      return `
      <!-- PÁGINA ${ch.pageNumber}: CAPÍTULO ${ch.chapterNumber} -->
      <div class="page" id="page-${ch.pageNumber}">
        <div class="page-header">
          <div class="header-left">
            <span class="brand-text">ALLMERA PARTNERS</span>
            <span class="brand-sub">BESS ENGINEERING ADVISORY</span>
          </div>
          <div class="header-right">
            <span>REF: ${dossierRefCode}</span> • <span>DOCUMENTO CONFIDENCIAL</span>
          </div>
        </div>

        <div class="chapter-badge">
          <span>CAPÍTULO ${ch.chapterNumber}</span> • <span>${ch.category}</span>
        </div>

        <h2 class="chapter-title">${ch.title}</h2>
        <h3 class="chapter-subtitle">${ch.subtitle}</h3>

        <div class="chapter-summary">
          ${ch.summary}
        </div>

        ${metricsHtml}
        ${diagramHtml}
        ${bulletsHtml}
        ${detailsHtml}
        ${normHtml}
        ${noteHtml}

        <div class="page-footer">
          <div class="footer-left">
            <span>${client.projectName || 'Projeto BESS'}</span> • <span>${client.clientName}</span>
          </div>
          <div class="footer-right">
            <span>Página ${ch.pageNumber} de ${totalPages}</span>
          </div>
        </div>
      </div>
      `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Dossiê Executivo BESS - ${client.projectName || 'Allmera Partners'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      font-size: 11pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Print toolbar (hidden when printing) */
    .no-print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #047857;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 13px;
    }

    .no-print-toolbar button {
      background: #ffffff;
      color: #047857;
      border: none;
      padding: 8px 18px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }

    .no-print-toolbar button:hover {
      background: #ecfdf5;
    }

    .dossier-wrapper {
      max-width: 210mm;
      margin: 20px auto;
      background: #ffffff;
    }

    /* Standardized A4 Page Container */
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 16mm 18mm 16mm 18mm;
      margin: 0 auto 20px auto;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      page-break-after: always !important;
      break-after: page !important;
      break-inside: avoid !important;
    }

    @media print {
      body {
        background: #ffffff !important;
      }
      .no-print-toolbar {
        display: none !important;
      }
      .dossier-wrapper {
        margin: 0 !important;
        box-shadow: none !important;
        max-width: none !important;
      }
      .page {
        margin: 0 !important;
        padding: 8mm 10mm 10mm 10mm !important;
        box-shadow: none !important;
        width: 100% !important;
        min-height: auto !important;
        break-after: page !important;
        page-break-after: always !important;
      }
    }

    /* Header & Footer */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #047857;
      padding-bottom: 8px;
      margin-bottom: 16px;
      font-size: 8.5pt;
    }

    .header-left {
      display: flex;
      flex-direction: column;
    }

    .brand-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #047857;
      letter-spacing: 0.5px;
      font-size: 9pt;
    }

    .brand-sub {
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-right {
      color: #64748b;
      font-size: 8pt;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
    }

    .page-footer {
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #64748b;
    }

    .footer-right {
      font-weight: 700;
      color: #047857;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Chapter Content */
    .chapter-badge {
      display: inline-block;
      align-self: flex-start;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .chapter-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 4px;
    }

    .chapter-subtitle {
      font-size: 10pt;
      color: #059669;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .chapter-summary {
      font-size: 9pt;
      color: #334155;
      line-height: 1.55;
      background: #f8fafc;
      border-left: 3px solid #059669;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 14px;
    }

    /* Key Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }

    .metric-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      border-radius: 8px;
    }

    .metric-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.4px;
    }

    .metric-value {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      margin: 2px 0;
    }

    .metric-hint {
      font-size: 7pt;
      color: #059669;
      font-weight: 600;
    }

    /* Bullet Points */
    .bullets-list {
      list-style: none;
      margin-bottom: 12px;
    }

    .bullets-list li {
      position: relative;
      padding-left: 18px;
      font-size: 8.5pt;
      color: #1e293b;
      margin-bottom: 6px;
      line-height: 1.45;
    }

    .bullets-list li::before {
      content: '▪';
      position: absolute;
      left: 4px;
      color: #059669;
      font-size: 12pt;
      top: -2px;
    }

    /* Diagram Cards */
    .diagram-card {
      margin: 10px 0;
      background: #0f172a;
      border-radius: 8px;
      padding: 10px;
      color: #f8fafc;
      border: 1px solid #1e293b;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .diagram-card svg {
      max-height: 180px;
      display: block;
    }

    /* Details Section */
    .details-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }

    .detail-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 11px;
      font-size: 8pt;
    }

    .detail-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 3px;
    }

    .detail-content {
      color: #475569;
      line-height: 1.4;
    }

    .norm-badge {
      font-size: 7.5pt;
      color: #475569;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      padding: 6px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .norm-label {
      font-weight: 700;
      color: #0f172a;
    }

    .rec-note {
      font-size: 8pt;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 4px;
    }

    /* COVER PAGE (PÁG 1) */
    .cover-page {
      justify-content: space-between;
    }

    .cover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #047857;
      padding-bottom: 14px;
    }

    .cover-hero {
      margin: 40px 0;
    }

    .cover-tag {
      display: inline-block;
      background: #047857;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 800;
      padding: 5px 14px;
      border-radius: 6px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .cover-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 12px;
    }

    .cover-project {
      font-size: 15pt;
      color: #047857;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .cover-desc {
      font-size: 10pt;
      color: #475569;
      line-height: 1.6;
      max-width: 90%;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 12px;
    }

    .cover-meta-item span {
      display: block;
    }

    .cover-meta-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }

    .cover-meta-val {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2px;
    }

    .cover-meta-sub {
      font-size: 8pt;
      color: #64748b;
    }

    /* SUMMARY PAGE (PÁG 2) */
    .summary-toc {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
      margin-top: 12px;
      font-size: 8pt;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 3px;
    }

    .toc-name {
      color: #334155;
      font-weight: 500;
    }

    .toc-page {
      font-weight: 700;
      color: #047857;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- Non-printable top action bar in standalone view -->
  <div class="no-print-toolbar">
    <div>
      <strong>Allmera Partners • Dossiê Executivo BESS</strong> (34 Páginas Completas)
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()">
        🖨️ Imprimir / Salvar como PDF (A4)
      </button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.2); color: #fff;">
        Fechar
      </button>
    </div>
  </div>

  <div class="dossier-wrapper">

    <!-- ==========================================
         PÁGINA 1: CAPA EXECUTIVA (FOLHA DE ROSTO)
         ========================================== -->
    <div class="page cover-page" id="page-1">
      <div class="cover-header">
        <div>
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20pt; font-weight: 800; color: #047857; letter-spacing: -0.02em;">ALLMERA PARTNERS</div>
          <div style="font-size: 9pt; color: #64748b; font-weight: 700; letter-spacing: 1px;">ENERGY & INFRASTRUCTURE ADVISORY</div>
        </div>
        <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #64748b;">
          <div>REF: ${dossierRefCode}</div>
          <div style="color: #047857; font-weight: 700;">DOCUMENTO CONFIDENCIAL</div>
        </div>
      </div>

      <div class="cover-hero">
        <div class="cover-tag">Estudo Executivo de Engenharia & Dimensionamento</div>
        <h1 class="cover-title">DOSSIÊ EXECUTIVO DE SISTEMA BESS</h1>
        <div class="cover-project">${client.projectName || 'Projeto de Armazenamento de Energia'}</div>
        <p class="cover-desc">
          Dimensionamento completo de engenharia (${sizing.nominalPowerMw} MW / ${sizing.nominalEnergyMwh} MWh), aderência às 12 aplicações do Cardápio Oficial BESS no Brasil, modelagem econômico-financeira de 15 anos e benchmark comparativo entre os 5 principais fabricantes homologados (Huawei, Sungrow, BYD, WEG e Tesla).
        </p>
      </div>

      <div class="cover-meta-grid">
        <div class="cover-meta-item">
          <span class="cover-meta-label">Cliente / Solicitante</span>
          <span class="cover-meta-val">${client.clientName}</span>
          <span class="cover-meta-sub">${client.city} - ${client.state}</span>
        </div>
        <div class="cover-meta-item">
          <span class="cover-meta-label">Distribuidora Local</span>
          <span class="cover-meta-val">${client.utilityCompany}</span>
          <span class="cover-meta-sub">${client.subgroup} • ${client.tariffModality}</span>
        </div>
        <div class="cover-meta-item">
          <span class="cover-meta-label">Solução Recomendada</span>
          <span class="cover-meta-val" style="color: #047857;">${vendor.vendorName}</span>
          <span class="cover-meta-sub">${vendor.productLine.split('(')[0]}</span>
        </div>
        <div class="cover-meta-item">
          <span class="cover-meta-label">Data de Emissão</span>
          <span class="cover-meta-val">${currentDate}</span>
          <span class="cover-meta-sub">Validade Técnica: 60 dias</span>
        </div>
      </div>

      <div class="page-footer">
        <div class="footer-left">
          <span>Allmera Partners Advisory • ART CREA-SP Registrada</span>
        </div>
        <div class="footer-right">
          <span>Página 1 de ${totalPages}</span>
        </div>
      </div>
    </div>

    <!-- ==========================================
         PÁGINA 2: SUMÁRIO GERAL & FICHA TÉCNICA
         ========================================== -->
    <div class="page" id="page-2">
      <div class="page-header">
        <div class="header-left">
          <span class="brand-text">ALLMERA PARTNERS</span>
          <span class="brand-sub">BESS ENGINEERING ADVISORY</span>
        </div>
        <div class="header-right">
          <span>REF: ${dossierRefCode}</span>
        </div>
      </div>

      <div class="chapter-badge">SUMÁRIO EXECUTIVO & ÍNDICE GERAL</div>
      <h2 class="chapter-title">Índice dos 34 Capítulos & Ficha Técnica</h2>
      <h3 class="chapter-subtitle">Visão estruturada de engenharia, aplicações do cardápio e viabilidade econômica</h3>

      <!-- Technical Spec Strip -->
      <div class="metrics-grid" style="margin-top: 8px;">
        <div class="metric-card">
          <div class="metric-label">Potência Nominal</div>
          <div class="metric-value">${sizing.nominalPowerMw} MW</div>
          <div class="metric-hint">${sizing.nominalPowerKw.toLocaleString('pt-BR')} kW</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Energia Armazenada</div>
          <div class="metric-value">${sizing.nominalEnergyMwh} MWh</div>
          <div class="metric-hint">${sizing.usableEnergyMwh} MWh úteis (90% DoD)</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Investimento (Capex)</div>
          <div class="metric-value">R$ ${(sizing.totalCapexBrl / 1000000).toFixed(2)}M</div>
          <div class="metric-hint">US$ ${(sizing.totalCapexUsd / 1000).toLocaleString('pt-BR')}k</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Payback & Retorno</div>
          <div class="metric-value">${sizing.simplePaybackYears} anos</div>
          <div class="metric-hint">TIR: ${sizing.irrPercent}% • VPL: R$ ${(sizing.npvBrl / 1000000).toFixed(2)}M</div>
        </div>
      </div>

      <div style="font-size: 8.5pt; font-weight: 700; color: #0f172a; margin-top: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">
        ÍNDICE SISTEMÁTICO DO DOSSIÊ (34 PÁGINAS):
      </div>

      <div class="summary-toc">
        <div class="toc-item"><span class="toc-name">01. Capa Executiva & Folha de Rosto</span><span class="toc-page">Pág. 01</span></div>
        <div class="toc-item"><span class="toc-name">02. Sumário Geral & Ficha Técnica</span><span class="toc-page">Pág. 02</span></div>
        <div class="toc-item"><span class="toc-name">03. Contexto Estratégico & SIN Brasileiro</span><span class="toc-page">Pág. 03</span></div>
        <div class="toc-item"><span class="toc-name">04. Diagnóstico Tarifário & Unidade Consumidora</span><span class="toc-page">Pág. 04</span></div>
        <div class="toc-item"><span class="toc-name">05. Cardápio Q1: Peak Shaving (Corte de Ponta)</span><span class="toc-page">Pág. 05</span></div>
        <div class="toc-item"><span class="toc-name">06. Cardápio Q2: Arbitragem ACL & PLD Horário</span><span class="toc-page">Pág. 06</span></div>
        <div class="toc-item"><span class="toc-name">07. Cardápio Q3: Gestão de Demanda Contratada</span><span class="toc-page">Pág. 07</span></div>
        <div class="toc-item"><span class="toc-name">08. Cardápio Q4: Backup Crítico & No-Break UPS</span><span class="toc-page">Pág. 08</span></div>
        <div class="toc-item"><span class="toc-name">09. Cardápio Q5: Hibridização Solar FV (PV+Storage)</span><span class="toc-page">Pág. 09</span></div>
        <div class="toc-item"><span class="toc-name">10. Cardápio Q6: Controle de Rampa (Ramp-Rate)</span><span class="toc-page">Pág. 10</span></div>
        <div class="toc-item"><span class="toc-name">11. Cardápio Q7: Suporte de Reativos & STATCOM</span><span class="toc-page">Pág. 11</span></div>
        <div class="toc-item"><span class="toc-name">12. Cardápio Q8: Serviços Ancilares & Frequência</span><span class="toc-page">Pág. 12</span></div>
        <div class="toc-item"><span class="toc-name">13. Cardápio Q9: Reserva de Capacidade (LRCAP)</span><span class="toc-page">Pág. 13</span></div>
        <div class="toc-item"><span class="toc-name">14. Cardápio Q10: Partida a Frio (Black Start)</span><span class="toc-page">Pág. 14</span></div>
        <div class="toc-item"><span class="toc-name">15. Cardápio Q11: Postergação de Subestação (T&D)</span><span class="toc-page">Pág. 15</span></div>
        <div class="toc-item"><span class="toc-name">16. Cardápio Q12: Microrredes & Ilhamento</span><span class="toc-page">Pág. 16</span></div>
        <div class="toc-item"><span class="toc-name">17. Dimensionamento Eletroquímico LFP</span><span class="toc-page">Pág. 17</span></div>
        <div class="toc-item"><span class="toc-name">18. Conversão de Potência (PCS)</span><span class="toc-page">Pág. 18</span></div>
        <div class="toc-item"><span class="toc-name">19. BMS em 3 Níveis de Segurança</span><span class="toc-page">Pág. 19</span></div>
        <div class="toc-item"><span class="toc-name">20. Gerenciamento Térmico (Liquid Cooling)</span><span class="toc-page">Pág. 20</span></div>
        <div class="toc-item"><span class="toc-name">21. Segurança Contra Incêndio & NFPA 855</span><span class="toc-page">Pág. 21</span></div>
        <div class="toc-item"><span class="toc-name">22. Sistema de Energia (EMS) & SCADA</span><span class="toc-page">Pág. 22</span></div>
        <div class="toc-item"><span class="toc-name">23. Balance of Plant (BOP) Civil & Fundações</span><span class="toc-page">Pág. 23</span></div>
        <div class="toc-item"><span class="toc-name">24. Diagrama Unifilar Executivo (SLD)</span><span class="toc-page">Pág. 24</span></div>
        <div class="toc-item"><span class="toc-name">25. Benchmark Brasil: Huawei Digital Power</span><span class="toc-page">Pág. 25</span></div>
        <div class="toc-item"><span class="toc-name">26. Benchmark Brasil: Sungrow Power Supply</span><span class="toc-page">Pág. 26</span></div>
        <div class="toc-item"><span class="toc-name">27. Benchmark Brasil: BYD Energy Brasil</span><span class="toc-page">Pág. 27</span></div>
        <div class="toc-item"><span class="toc-name">28. Benchmark Brasil: WEG Equipamentos Elétricos</span><span class="toc-page">Pág. 28</span></div>
        <div class="toc-item"><span class="toc-name">29. Benchmark Brasil: Tesla Energy</span><span class="toc-page">Pág. 29</span></div>
        <div class="toc-item"><span class="toc-name">30. Parecer Técnico Oficial Allmera</span><span class="toc-page">Pág. 30</span></div>
        <div class="toc-item"><span class="toc-name">31. Modelagem Financeira & Capex 15 Anos</span><span class="toc-page">Pág. 31</span></div>
        <div class="toc-item"><span class="toc-name">32. Marco Regulatório & Aneel REN 1.000</span><span class="toc-page">Pág. 32</span></div>
        <div class="toc-item"><span class="toc-name">33. Roteiro de Conexão na Distribuidora</span><span class="toc-page">Pág. 33</span></div>
        <div class="toc-item"><span class="toc-name">34. Comissionamento, O&M & Conclusão Técnica</span><span class="toc-page">Pág. 34</span></div>
      </div>

      <div class="page-footer">
        <div class="footer-left">
          <span>${client.projectName || 'Projeto BESS'} • Allmera Partners</span>
        </div>
        <div class="footer-right">
          <span>Página 2 de ${totalPages}</span>
        </div>
      </div>
    </div>

    <!-- PÁGINAS 3 A 34: 32 CAPÍTULOS TÉCNICOS DETALHADOS -->
    ${chaptersHtml}

  </div>
</body>
</html>`;
}

/**
 * Dispara a impressão em uma nova aba/janela isolada (Top-level window),
 * eliminando restrições de sandbox de iframes e garantindo o diálogo nativo de PDF.
 */
export function exportDossierToPrintWindow(options: ExportDossierOptions): boolean {
  try {
    const html = buildDossierHtml(options);
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      // Popup bloqueado pelo navegador - fallback para download direto
      downloadDossierHtmlDocument(options);
      return false;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // Aguarda carregar fontes e renderizar antes de disparar print
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (err) {
        console.warn('Erro ao disparar print direto na nova janela:', err);
      }
    }, 600);

    return true;
  } catch (error) {
    console.error('Erro na exportação para janela de impressão:', error);
    downloadDossierHtmlDocument(options);
    return false;
  }
}

/**
 * Cria um arquivo HTML autossuficiente e dispara o download imediato
 * (permite ao usuário abrir no Chrome/Edge e salvar como PDF em 1 clique).
 */
export function downloadDossierHtmlDocument(options: ExportDossierOptions): void {
  try {
    const html = buildDossierHtml(options);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (options.client.clientName || 'Allmera')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    a.href = url;
    a.download = `Dossie_Executivo_BESS_${safeName}_34Paginas.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar documento de dossiê:', error);
  }
}
