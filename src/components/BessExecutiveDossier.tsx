import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { AllmeraLogo } from './AllmeraLogo';
import {
  BessClientProfile,
  BessSizingInput,
  BessSizingResult,
  BessVendorProduct,
} from '../types/bess';
import {
  generateDossierChapters,
  DossierChapter,
} from '../data/bessDossierChapters';
import {
  exportDossierToPrintWindow,
  downloadDossierHtmlDocument,
} from '../utils/bessPdfExporter';
import {
  renderSingleLineDiagramSvg,
  renderMechanicalLayoutSvg,
  renderDailyDispatchChartSvg,
  renderBatteryDegradationChartSvg,
  renderLiquidCoolingSchematicSvg,
  renderBrazilVendorsComparisonSummarySvg,
} from '../utils/bessDiagramGenerators';

interface BessExecutiveDossierProps {
  client: BessClientProfile;
  input: BessSizingInput;
  sizing: BessSizingResult;
  vendor: BessVendorProduct;
  onBackToConfig?: () => void;
}

export const BessExecutiveDossier: React.FC<BessExecutiveDossierProps> = ({
  client,
  input,
  sizing,
  vendor,
  onBackToConfig,
}) => {
  const [viewMode, setViewMode] = useState<'continuous' | 'paginated'>('continuous');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showChapterDrawer, setShowChapterDrawer] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const dossierRefCode = useMemo(() => {
    const hash = Math.abs(
      (client.clientName || 'ALLMERA')
        .split('')
        .reduce((a, b) => a + b.charCodeAt(0), 1000)
    )
      .toString()
      .padStart(4, '0');
    return `ALLM-BESS-${client.state || 'BR'}-${hash}-REV4`;
  }, [client.clientName, client.state]);

  // Gera os 32 capítulos de conteúdo técnico detalhado (totalizando 34 páginas com capa e índice)
  const chapters = useMemo(() => {
    return generateDossierChapters(client, input, sizing, vendor);
  }, [client, input, sizing, vendor]);

  const totalPages = 34;

  const handleExportPrint = () => {
    setExportNotice('Gerando documento A4 formatado em nova janela para impressão / PDF...');
    const success = exportDossierToPrintWindow({
      client,
      input,
      sizing,
      vendor,
      chapters,
      dossierRefCode,
      currentDate,
    });
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadStandalone = () => {
    setExportNotice('Baixando arquivo autossuficiente de 34 páginas...');
    downloadDossierHtmlDocument({
      client,
      input,
      sizing,
      vendor,
      chapters,
      dossierRefCode,
      currentDate,
    });
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleDirectWindowPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          TOP ACTION & EXPORT BAR (HIDDEN IN PRINT)
         ======================================================== */}
      <div className="print:hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wide uppercase">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dossiê Completo • 34 Páginas de Engenharia
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Ref: {dossierRefCode}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1">
              Dossiê Executivo de BESS • {client.projectName || 'Projeto de Armazenamento'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Documento técnico-comercial exaustivo com 34 capítulos dedicados às 12 questões do Cardápio BESS, dimensionamento elétrico, benchmark dos 5 fabricantes no Brasil e viabilidade financeira.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onBackToConfig && (
              <button
                onClick={onBackToConfig}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Ajustar Parâmetros
              </button>
            )}

            {/* Principal: Exportar / Imprimir PDF */}
            <button
              onClick={handleExportPrint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              title="Abre o documento em nova aba com diálogo de impressão nativo A4 para salvar em PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Exportar / Imprimir PDF</span>
            </button>

            {/* Alternativo: Baixar Documento Standalone */}
            <button
              onClick={handleDownloadStandalone}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Baixa o documento completo em arquivo único HTML para abrir e salvar em PDF a qualquer momento"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar Arquivo Completo</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {exportNotice && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {exportNotice}
            </span>
            <span className="text-[11px] opacity-80">Aguarde...</span>
          </div>
        )}

        {/* Mode Selector & Quick Navigator Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/60 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Modo de Leitura:</span>
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('continuous')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Documento Contínuo (34 Páginas)
              </button>
              <button
                onClick={() => setViewMode('paginated')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                  viewMode === 'paginated'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Leitor por Capítulo ({currentPage}/34)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'paginated' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer"
                  title="Página Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono font-bold text-xs px-2 text-emerald-900">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer"
                  title="Próxima Página"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setShowChapterDrawer(!showChapterDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
              <span>Sumário de Capítulos</span>
            </button>
          </div>
        </div>

        {/* Chapter Index Quick Drawer */}
        {showChapterDrawer && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-700" />
                Navegador Rápido de Capítulos (Clique para ir direto à página):
              </h4>
              <button
                onClick={() => setShowChapterDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setViewMode('paginated');
                  setShowChapterDrawer(false);
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left cursor-pointer transition-all"
              >
                <div className="text-[10px] text-emerald-700 font-bold">Pág. 01</div>
                <div className="font-semibold text-slate-800 truncate">Capa Executiva & Identificação</div>
              </button>

              <button
                onClick={() => {
                  setCurrentPage(2);
                  setViewMode('paginated');
                  setShowChapterDrawer(false);
                }}
                className="p-2 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left cursor-pointer transition-all"
              >
                <div className="text-[10px] text-emerald-700 font-bold">Pág. 02</div>
                <div className="font-semibold text-slate-800 truncate">Sumário & Ficha Técnica</div>
              </button>

              {chapters.map((ch) => (
                <button
                  key={ch.pageNumber}
                  onClick={() => {
                    setCurrentPage(ch.pageNumber);
                    setViewMode('paginated');
                    setShowChapterDrawer(false);
                  }}
                  className="p-2 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left cursor-pointer transition-all"
                >
                  <div className="text-[10px] text-emerald-700 font-bold">
                    Pág. {ch.pageNumber.toString().padStart(2, '0')} • Cap. {ch.chapterNumber}
                  </div>
                  <div className="font-semibold text-slate-800 truncate">{ch.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          DOCUMENT VIEWER CONTAINER (A4 FORMATTED)
         ======================================================== */}
      <div className="dossier-print-container font-sans text-slate-900">
        
        {/* ======================================================
            PÁGINA 1: CAPA EXECUTIVA (FOLHA DE ROSTO)
           ====================================================== */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <div className="dossier-page bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-sm mb-8 print:shadow-none print:border-none print:p-0 print:m-0 flex flex-col justify-between min-h-[920px]">
            <div>
              {/* Top Bar of Cover */}
              <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-6 mb-12">
                <AllmeraLogo size="lg" subtitle="BESS Engineering Advisory" />
                <div className="text-right font-mono text-xs text-slate-500">
                  <div className="font-bold text-slate-700">REF: {dossierRefCode}</div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    DOCUMENTO CONFIDENCIAL
                  </div>
                </div>
              </div>

              {/* Cover Main Content */}
              <div className="space-y-4 my-8">
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-md uppercase tracking-wider">
                  Estudo de Engenharia, Dimensionamento & Viabilidade
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-slate-900 leading-tight">
                  DOSSIÊ EXECUTIVO DE SISTEMA BESS
                </h1>

                <p className="text-lg sm:text-2xl font-bold text-emerald-800">
                  {client.projectName || 'Dimensionamento e Viabilidade Técnico-Comercial de Baterias'}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed pt-2">
                  Avaliação exaustiva de aderência ao <strong>Cardápio de Serviços de BESS no Brasil</strong>, dimensionamento elétrico de potência (<strong>{sizing.nominalPowerMw} MW</strong>) e energia (<strong>{sizing.nominalEnergyMwh} MWh</strong>), análise comparativa dos principais fabricantes com suporte nacional e modelagem financeira completa em 15 anos.
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs mt-12">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Cliente / Solicitante
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{client.clientName}</span>
                  <span className="text-slate-500">{client.city} - {client.state}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Distribuidora Local
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{client.utilityCompany}</span>
                  <span className="text-slate-500">{client.subgroup} • {client.tariffModality}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Solução de Referência
                  </span>
                  <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{vendor.vendorName}</span>
                  <span className="text-slate-500">{vendor.productLine.split('(')[0]}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                    Data de Emissão
                  </span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentDate}</span>
                  <span className="text-slate-500">Validade Técnica: 60 dias</span>
                </div>
              </div>
            </div>

            {/* Cover Footer */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 mt-auto">
              <span>Allmera Partners Advisory & Energy Engineering • Responsabilidade Técnica CREA-SP</span>
              <span className="font-mono text-emerald-800 font-bold">Página 1 de {totalPages}</span>
            </div>
          </div>
        )}

        {/* ======================================================
            PÁGINA 2: SUMÁRIO GERAL & FICHA TÉCNICA
           ====================================================== */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <div className="dossier-page bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-sm mb-8 print:shadow-none print:border-none print:p-0 print:m-0 flex flex-col justify-between min-h-[920px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-3 mb-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-800 tracking-wider">ALLMERA PARTNERS</span>
                  <span className="text-slate-300">•</span>
                  <span>BESS Engineering Advisory</span>
                </div>
                <div className="font-mono font-bold text-slate-600">REF: {dossierRefCode}</div>
              </div>

              {/* Title */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  Sumário Executivo & Índice
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  Índice Geral do Dossiê & Ficha Técnica Executiva
                </h2>
                <p className="text-xs text-slate-600">
                  Visão estruturada de todos os 34 capítulos de engenharia, aplicações do cardápio e viabilidade econômica.
                </p>
              </div>

              {/* Executive Metrics Highlight */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Potência Nominal</span>
                  <div className="text-lg font-bold tracking-tight tabular-nums text-emerald-950 mt-0.5">{sizing.nominalPowerMw} MW</div>
                  <span className="text-[11px] text-emerald-700 font-medium">{sizing.nominalPowerKw.toLocaleString('pt-BR')} kW</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Energia Armazenada</span>
                  <div className="text-lg font-bold tracking-tight tabular-nums text-slate-900 mt-0.5">{sizing.nominalEnergyMwh} MWh</div>
                  <span className="text-[11px] text-slate-500 font-medium">{sizing.usableEnergyMwh} MWh úteis ({input.durationHours}h)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Investimento Total (Capex)</span>
                  <div className="text-lg font-bold tracking-tight tabular-nums text-slate-900 mt-0.5">R$ {(sizing.totalCapexBrl / 1_000_000).toFixed(2)} M</div>
                  <span className="text-[11px] text-slate-500 font-medium">US$ {(sizing.totalCapexUsd / 1_000).toLocaleString('pt-BR')}k</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Retorno & TIR</span>
                  <div className="text-lg font-bold tracking-tight tabular-nums text-emerald-950 mt-0.5">{sizing.simplePaybackYears} anos</div>
                  <span className="text-[11px] text-emerald-700 font-medium">TIR: {sizing.irrPercent}% • VPL: R$ {(sizing.npvBrl / 1_000_000).toFixed(2)}M</span>
                </div>
              </div>

              {/* Table of Contents 34 Chapters */}
              <div className="text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 mb-3">
                  Índice Sistemático do Dossiê Completo (34 Páginas):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span>01. Capa Executiva & Identificação do Projeto</span>
                    <span className="font-mono font-bold text-emerald-700">Pág. 01</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-100">
                    <span>02. Sumário Geral & Ficha Técnica Executiva</span>
                    <span className="font-mono font-bold text-emerald-700">Pág. 02</span>
                  </div>
                  {chapters.map((ch) => (
                    <div key={ch.pageNumber} className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="truncate pr-2">
                        {ch.pageNumber.toString().padStart(2, '0')}. Cap. {ch.chapterNumber}: {ch.title.split(':')[0]}
                      </span>
                      <span className="font-mono font-bold text-emerald-700 shrink-0">
                        Pág. {ch.pageNumber.toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 mt-auto">
              <span>{client.projectName || 'Projeto BESS'} • {client.clientName}</span>
              <span className="font-mono text-emerald-800 font-bold">Página 2 de {totalPages}</span>
            </div>
          </div>
        )}

        {/* ======================================================
            PÁGINAS 3 A 34: 32 CAPÍTULOS TÉCNICOS ESPECÍFICOS
           ====================================================== */}
        {chapters.map((ch) => {
          if (viewMode === 'paginated' && currentPage !== ch.pageNumber) {
            return null;
          }

          return (
            <div
              key={ch.pageNumber}
              id={`dossier-page-${ch.pageNumber}`}
              className="dossier-page bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-sm mb-8 print:shadow-none print:border-none print:p-0 print:m-0 flex flex-col justify-between min-h-[920px]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-2.5 mb-6 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 tracking-wider">ALLMERA PARTNERS</span>
                    <span className="text-slate-300">•</span>
                    <span>BESS Engineering Advisory</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-600">
                    REF: {dossierRefCode} • CAPÍTULO {ch.chapterNumber}
                  </div>
                </div>

                {/* Chapter Header */}
                <div className="space-y-1.5 mb-5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    <span>CAPÍTULO {ch.chapterNumber}</span>
                    <span>•</span>
                    <span>{ch.category}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                    {ch.title}
                  </h2>

                  <h3 className="text-xs sm:text-sm font-semibold text-emerald-800">
                    {ch.subtitle}
                  </h3>
                </div>

                {/* Executive Summary Box */}
                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-emerald-600 mb-5 text-xs text-slate-700 leading-relaxed shadow-2xs">
                  {ch.summary}
                </div>

                {/* Key Metrics Grid */}
                {ch.keyMetrics && ch.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs">
                    {ch.keyMetrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          {m.label}
                        </span>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5">
                          {m.value}
                        </div>
                        {m.hint && (
                          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                            {m.hint}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Conceptual Electrical / Mechanical Schematics & Analytical Charts */}
                {(() => {
                  const chNum = Number(ch.chapterNumber);
                  const diagConfig = { client, input, sizing, vendor };
                  let svgHtml = '';
                  if (chNum === 3) svgHtml = renderDailyDispatchChartSvg(diagConfig);
                  else if (chNum === 15) svgHtml = renderBatteryDegradationChartSvg(diagConfig);
                  else if (chNum === 18) svgHtml = renderLiquidCoolingSchematicSvg(diagConfig);
                  else if (chNum === 21) svgHtml = renderMechanicalLayoutSvg(diagConfig);
                  else if (chNum === 22) svgHtml = renderSingleLineDiagramSvg(diagConfig);
                  else if (chNum === 28 || chNum === 29) svgHtml = renderBrazilVendorsComparisonSummarySvg(diagConfig);

                  if (!svgHtml) return null;
                  return (
                    <div
                      className="mb-6 rounded-xl overflow-hidden shadow-xs border border-slate-800"
                      dangerouslySetInnerHTML={{ __html: svgHtml }}
                    />
                  );
                })()}

                {/* Bullet Points */}
                {ch.bulletPoints && ch.bulletPoints.length > 0 && (
                  <div className="space-y-2 mb-5 text-xs text-slate-700">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Diretrizes Técnicas & Critérios Operacionais:
                    </h4>
                    <ul className="space-y-2">
                      {ch.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Details Grid */}
                {ch.technicalDetails && ch.technicalDetails.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
                    {ch.technicalDetails.map((det, dIdx) => (
                      <div key={dIdx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                        <strong className="text-slate-900 block mb-1 text-[11px] font-bold border-b border-slate-100 pb-1">
                          {det.title}
                        </strong>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {det.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Regulatory / Normative Banner */}
                {ch.regulatoryOrNormative && (
                  <div className="p-2.5 rounded-lg bg-slate-100/70 border border-slate-200/80 text-[11px] text-slate-600 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Normas & Regulamentação Aplicável:</strong> {ch.regulatoryOrNormative}
                    </span>
                  </div>
                )}

                {/* Recommendation Note */}
                {ch.recommendationNote && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2 shadow-2xs">
                    <Award className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-[11px]">Recomendação Técnica da Allmera Partners:</strong>
                      <span>{ch.recommendationNote}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 mt-auto">
                <span>{client.projectName || 'Projeto BESS'} • {client.clientName}</span>
                <span className="font-mono text-emerald-800 font-bold">
                  Página {ch.pageNumber} de {totalPages}
                </span>
              </div>
            </div>
          );
        })}

        {/* ======================================================
            TERMO DE ASSINATURA TÉCNICA E RESPONSABILIDADE
           ====================================================== */}
        {(viewMode === 'continuous' || currentPage === 34) && (
          <div className="dossier-page bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-sm mb-8 print:shadow-none print:border-none print:p-0 print:m-0 space-y-8">
            <div className="flex items-center gap-2 border-b-2 border-emerald-700 pb-3">
              <span className="h-6 w-1.5 bg-emerald-600 rounded-full" />
              <h2 className="text-xl font-bold font-display text-slate-900">
                Homologação de Engenharia & Termo de Encerramento
              </h2>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O presente Dossiê Executivo de BESS foi elaborado pela equipe multidisciplinar de transição energética da Allmera Partners com base nos parâmetros operacionais fornecidos por {client.clientName}. O estudo possui validade técnica de 60 dias e está vinculado ao registro de Anotação de Responsabilidade Técnica (ART) junto ao CREA competente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="border-t-2 border-slate-900 pt-3 text-xs">
                <p className="font-bold text-slate-900 text-sm">Dr. Eng. Responsável Técnico de BESS</p>
                <p className="text-slate-600 font-medium">Conselho Regional de Engenharia e Agronomia (CREA-SP)</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">ART de Estudo e Dimensionamento: 2026/049182-SP</p>
                <p className="text-[10px] text-emerald-800 font-mono">Assinatura Digital ICP-Brasil SHA-256 Validada</p>
              </div>

              <div className="border-t-2 border-slate-900 pt-3 text-xs">
                <p className="font-bold text-slate-900 text-sm">Diretoria de Transição Energética & Infraestrutura</p>
                <p className="text-slate-600 font-medium">Allmera Partners Advisory Group</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Protocolo de Certificação Técnica v4.2</p>
                <p className="text-[10px] text-emerald-800 font-mono">São Paulo • Campinas • Rio de Janeiro • BH</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
