// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
var app = express();
var PORT = 3e3;
app.use(express.json());
var ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.post("/api/ai/analyze-region", async (req, res) => {
  try {
    const { regionName, country, itLoadMw, targetWorkload, customNotes } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Chave GEMINI_API_KEY n\xE3o configurada no ambiente.",
        fallbackNotice: "Usando motor de dados est\xE1tico e modelagem param\xE9trica local."
      });
    }
    const prompt = `Voc\xEA \xE9 um diretor s\xEAnior de infraestrutura de hiperescala e regula\xE7\xE3o de energia especializado no desenvolvimento de Data Centers de IA em todo o continente americano.

Analise a viabilidade detalhada de implanta\xE7\xE3o de um Data Center de IA com as seguintes especifica\xE7\xF5es:
- Regi\xE3o/Mercado: ${regionName}, ${country}
- Carga de TI Projetada: ${itLoadMw || 100} MW (Alta densidade, liquid cooling direct-to-chip)
- Perfil de Carga: ${targetWorkload || "Treinamento de LLMs + Infer\xEAncia Mista"}
- Contexto Adicional: ${customNotes || "Nenhum"}

Estruture a resposta em portugu\xEAs claro, t\xE9cnico e executivo com os seguintes t\xF3picos:
1. DIAGN\xD3STICO DO SISTEMA EL\xC9TRICO & INTERCONEX\xC3O: Capacidade da rede local, tempo estimado de fila de conex\xE3o (interconnection queue), estabilidade/conting\xEAncia N+1/2N e riscos de curtailment ou congestionamento de transmiss\xE3o.
2. LAT\xCANCIA & CONECTIVIDADE DE DADOS: RTT at\xE9 os principais backbones (Ashburn VA, Miami NAP, S\xE3o Paulo IX.br, Quer\xE9taro, Santiago), cabos submarinos e adequa\xE7\xE3o para treinamento distribu\xEDdo vs infer\xEAncia de baixa lat\xEAncia.
3. MARCO REGULAT\xD3RIO & ENERGIA RENOV\xC1VEL: Estrutura de PPAs livres, regime de autoprodu\xE7\xE3o de energia (ex: isen\xE7\xE3o de TUSD/encargos setoriais ou regras locais), certifica\xE7\xE3o I-REC/24x7 Carbon-Free Energy, e licenciamento ambiental com \xEAnfase em restri\xE7\xF5es de estresse h\xEDdrico / PUE.
4. RECOMENDA\xC7\xC3O ESTRAT\xC9GICA & MITIGA\xC7\xC3O DE RISCO: A\xE7\xF5es pr\xE1ticas para o desenvolvedor (ex: implanta\xE7\xE3o de BESS, cogera\xE7\xE3o de transi\xE7\xE3o, contratos bilaterais sint\xE9ticos, trocadores adiab\xE1ticos de circuito fechado).

Forne\xE7a uma an\xE1lise aprofundada, com dados quantitativos realistas e orienta\xE7\xF5es executivas diretas.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    res.json({
      success: true,
      analysis: response.text,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    res.status(500).json({
      error: "Falha ao processar an\xE1lise via Gemini AI.",
      details: error?.message || "Erro desconhecido"
    });
  }
});
app.post("/api/ai/simulate-scenario", async (req, res) => {
  try {
    const { scenarioData } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Chave GEMINI_API_KEY n\xE3o configurada no ambiente."
      });
    }
    const prompt = `Como especialista em modelagem t\xE9cnico-econ\xF4mica de datacenters de IA nas Am\xE9ricas, analise esta simula\xE7\xE3o:
${JSON.stringify(scenarioData, null, 2)}

Identifique os 3 maiores gargalos operacionais/regulat\xF3rios desta configura\xE7\xE3o e recomende 3 otimiza\xE7\xF5es financeiras ou de engenharia para maximizar o ROI e acelerar o Time-to-Market de energiza\xE7\xE3o. Responda em portugu\xEAs conciso e orientado a decis\xF5es em bullet points ricos.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    res.json({
      success: true,
      recommendations: response.text
    });
  } catch (error) {
    console.error("Error generating scenario simulation:", error);
    res.status(500).json({
      error: "Erro na simula\xE7\xE3o do cen\xE1rio.",
      details: error?.message || "Erro desconhecido"
    });
  }
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT} in ${isProd ? "production" : "development"} mode`);
  });
}
startServer();
