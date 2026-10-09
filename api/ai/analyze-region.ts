import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { regionName, country, itLoadMw, targetWorkload, customNotes } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente do Vercel.',
        fallbackNotice: 'Configure GEMINI_API_KEY nas variáveis de ambiente da Vercel para geração dinâmica.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        },
      },
    });

    const prompt = `Você é um diretor sênior de infraestrutura de hiperescala e regulação de energia especializado no desenvolvimento de Data Centers de IA em todo o continente americano.

Analise a viabilidade detalhada de implantação de um Data Center de IA com as seguintes especificações:
- Região/Mercado: ${regionName || 'Região Selecionada'}, ${country || 'Américas'}
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

    return res.status(200).json({
      success: true,
      analysis: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    return res.status(500).json({
      error: 'Falha ao processar análise via Gemini AI.',
      details: error?.message || 'Erro desconhecido',
    });
  }
}
