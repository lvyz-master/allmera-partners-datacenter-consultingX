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
    const { scenarioData } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no ambiente do Vercel.',
        fallbackNotice: 'Configure GEMINI_API_KEY nas variáveis de ambiente da Vercel para simulações ao vivo.',
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

    const prompt = `Como especialista em modelagem técnico-econômica de datacenters de IA nas Américas, analise esta simulação:
${JSON.stringify(scenarioData, null, 2)}

Identifique os 3 maiores gargalos operacionais/regulatórios desta configuração e recomende 3 otimizações financeiras ou de engenharia para maximizar o ROI e acelerar o Time-to-Market de energização. Responda em português conciso e orientado a decisões em bullet points ricos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      recommendations: response.text,
    });
  } catch (error: any) {
    console.error('Error in simulate scenario:', error);
    return res.status(500).json({
      error: 'Erro na simulação do cenário.',
      details: error?.message || 'Erro desconhecido',
    });
  }
}
