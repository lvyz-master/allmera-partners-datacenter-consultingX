import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint for AI Data Center Regional & Regulatory Analysis
app.post('/api/ai/analyze-region', async (req, res) => {
  try {
    const { regionName, country, itLoadMw, targetWorkload, customNotes } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente.',
        fallbackNotice: 'Usando motor de dados estático e modelagem paramétrica local.',
      });
    }

    const prompt = `Você é um diretor sênior de infraestrutura de hiperescala e regulação de energia especializado no desenvolvimento de Data Centers de IA em todo o continente americano.

Analise a viabilidade detalhada de implantação de um Data Center de IA com as seguintes especificações:
- Região/Mercado: ${regionName}, ${country}
- Carga de TI Projetada: ${itLoadMw || 100} MW (Alta densidade, liquid cooling direct-to-chip)
- Perfil de Carga: ${targetWorkload || 'Treinamento de LLMs + Inferência Mista'}
- Contexto Adicional: ${customNotes || 'Nenhum'}

Estruture a resposta em português claro, técnico e executivo com os seguintes tópicos:
1. DIAGNÓSTICO DO SISTEMA ELÉTRICO & INTERCONEXÃO: Capacidade da rede local, tempo estimado de fila de conexão (interconnection queue), estabilidade/contingência N+1/2N e riscos de curtailment ou congestionamento de transmissão.
2. LATÊNCIA & CONECTIVIDADE DE DADOS: RTT até os principais backbones (Ashburn VA, Miami NAP, São Paulo IX.br, Querétaro, Santiago), cabos submarinos e adequação para treinamento distribuído vs inferência de baixa latência.
3. MARCO REGULATÓRIO & ENERGIA RENOVÁVEL: Estrutura de PPAs livres, regime de autoprodução de energia (ex: isenção de TUSD/encargos setoriais ou regras locais), certificação I-REC/24x7 Carbon-Free Energy, e licenciamento ambiental com ênfase em restrições de estresse hídrico / PUE.
4. RECOMENDAÇÃO ESTRATÉGICA & MITIGAÇÃO DE RISCO: Ações práticas para o desenvolvedor (ex: implantação de BESS, cogeração de transição, contratos bilaterais sintéticos, trocadores adiabáticos de circuito fechado).

Forneça uma análise aprofundada, com dados quantitativos realistas e orientações executivas diretas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      analysis: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({
      error: 'Falha ao processar análise via Gemini AI.',
      details: error?.message || 'Erro desconhecido',
    });
  }
});

// Endpoint for custom scenario simulator advisory
app.post('/api/ai/simulate-scenario', async (req, res) => {
  try {
    const { scenarioData } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente.',
      });
    }

    const prompt = `Como especialista em modelagem técnico-econômica de datacenters de IA nas Américas, analise esta simulação:
${JSON.stringify(scenarioData, null, 2)}

Identifique os 3 maiores gargalos operacionais/regulatórios desta configuração e recomende 3 otimizações financeiras ou de engenharia para maximizar o ROI e acelerar o Time-to-Market de energização. Responda em português conciso e orientado a decisões em bullet points ricos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      recommendations: response.text,
    });
  } catch (error: any) {
    console.error('Error generating scenario simulation:', error);
    res.status(500).json({
      error: 'Erro na simulação do cenário.',
      details: error?.message || 'Erro desconhecido',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
