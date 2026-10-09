import React, { useState, useEffect } from 'react';
import { RegionData } from '../types/datacenter';
import { X, Cpu, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface AIAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRegion?: RegionData | null;
  scenarioData?: any | null;
}

export const AIAssessmentModal: React.FC<AIAssessmentModalProps> = ({
  isOpen,
  onClose,
  targetRegion,
  scenarioData,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateAnalysis();
    } else {
      setAnalysisText('');
      setError(null);
    }
  }, [isOpen, targetRegion, scenarioData]);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      if (scenarioData) {
        // Scenario advisory
        const res = await fetch('/api/ai/simulate-scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioData }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Falha ao processar simulação.');
        }
        setAnalysisText(data.recommendations || 'Nenhuma recomendação retornada.');
      } else if (targetRegion) {
        // Regional deep-dive analysis
        const res = await fetch('/api/ai/analyze-region', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            regionName: targetRegion.name,
            country: targetRegion.country,
            itLoadMw: 80,
            targetWorkload: 'Treinamento de LLMs + Inferência Corporativa',
            customNotes: `Tarifa média: $${targetRegion.grid.averageIndustrialTariffUsdMwh}/MWh. Fila de subestação: ${targetRegion.grid.interconnectionQueueMonths} meses. Matriz renovável: ${targetRegion.grid.gridRenewablePercentage}%. Regime: ${targetRegion.regulatory.selfGenerationRegime}`,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Falha ao gerar análise regional.');
        }
        setAnalysisText(data.analysis || 'Nenhuma análise gerada.');
      }
    } catch (err: any) {
      console.error('AI generate error:', err);
      setError(
        err.message || 'Erro ao conectar com a API do Gemini. Certifique-se de que o backend está ativo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisText) return;
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-slate-900">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Parecer Executivo de IA · Gemini 3.8 Flash</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-medium border border-emerald-200">
                  Allmera Partners
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {scenarioData
                  ? `Simulação Customizada: ${scenarioData.region} (${scenarioData.itLoadMw} MW)`
                  : targetRegion
                  ? `Dossiê Estratégico: ${targetRegion.name}, ${targetRegion.country}`
                  : 'Análise Estratégica Multirregional'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysisText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                title="Copiar texto"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 animate-spin">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">Sintetizando Parecer Técnico de Infraestrutura...</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Avaliando capacidade de subestações locais, tempos de fila de conexão, regime tributário de autoprodução e rotas de cabos submarinos.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertCircle className="h-5 w-5" />
                <span>Não foi possível gerar a análise em tempo real</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
              <button
                onClick={generateAnalysis}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Tentar novamente</span>
              </button>
            </div>
          )}

          {!loading && !error && analysisText && (
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 mb-6 flex items-center justify-between">
                <span>Relatório técnico emitido em conformidade com as diretrizes do IEEE, CCEE, CENACE e CNE.</span>
                <span className="font-mono text-[11px] text-emerald-700 font-semibold">Geração 2026</span>
              </div>

              {/* Formatted Markdown Output */}
              <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed space-y-3">
                {analysisText.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('###') || paragraph.startsWith('##') || paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.')) {
                    return (
                      <h4 key={index} className="text-base font-bold text-slate-900 border-l-2 border-emerald-600 pl-3 mt-6 mb-2">
                        {paragraph.replace(/^#+\s*/, '')}
                      </h4>
                    );
                  }
                  return (
                    <p key={index} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>Bruno Zavaleta DataCenter · Inteligência de Infraestrutura de IA</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
