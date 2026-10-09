# Allmera Partners Data Center Consulting

Plataforma executiva de inteligência e modelagem para desenvolvimento de Data Centers de IA nas Américas: análise de infraestrutura elétrica, sustentabilidade, fornecedores (Huawei vs. Schneider vs. Vertiv vs. Eaton), TCO Capex/Opex e cartografia estratégica.

---

## ⚡ Conexão com GitHub e Deploy no Vercel (Passo a Passo)

Este repositório está 100% configurado e pronto para deploy automático no **Vercel** com suporte a Vite SPA, roteamento e Serverless Functions via `vercel.json`.

### 1️⃣ Passo 1: Subir o projeto para o GitHub

1. Crie um novo repositório vazio no seu GitHub: [github.com/new](https://github.com/new)
   - Nome sugerido: `allmera-partners-datacenter`
   - Pode ser **Público** ou **Privado**.
   - **Não** marque a opção de criar README ou .gitignore (já estão incluídos neste projeto).
2. Na sua máquina (ou terminal do projeto):
   ```bash
   git init
   git add .
   git commit -m "feat: Allmera Partners Data Center Consulting ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/allmera-partners-datacenter.git
   git push -u origin main
   ```

---

### 2️⃣ Passo 2: Conectar ao Vercel e Gerar o Link Web

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua própria conta do GitHub).
2. No painel principal (Dashboard), clique em **"Add New..."** → **"Project"**.
3. Selecione o repositório que acabou de criar no GitHub (`allmera-partners-datacenter`) e clique em **Import**.
4. **Configurações do Projeto:**
   - O Vercel detectará automaticamente o framework como **Vite** graças ao arquivo `vercel.json` pré-configurado.
   - **Build Command:** `npm run build` (ou `vite build`)
   - **Output Directory:** `dist`
5. *(Opcional)* Na seção **Environment Variables**, adicione:
   - `GEMINI_API_KEY`: sua chave de API do Google Gemini (para consultas generativas em tempo real).
   - *Nota:* Se não adicionar a chave, a aplicação continuará funcionando perfeitamente com análises estruturadas paramétricas locais.
6. Clique no botão **"Deploy"**.
7. Em cerca de 45 segundos, o Vercel fornecerá seu link web permanente (ex: `https://allmera-partners-datacenter.vercel.app`), com certificado SSL gratuito e alta velocidade global.

---

## 🔐 Acesso à Plataforma

Para acessar os módulos executivos:
- **Usuário padrão:** `Allmera`
- **Senha padrão:** `12345`

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Deployment & Hosting:** Vercel (com `vercel.json` e rotas `/api/*` em Serverless Functions)
- **Local Dev / Full-Stack:** Node.js Express (`tsx server.ts`), Vite
- **Modelagem de IA:** Google GenAI SDK (Gemini 3.8 Flash) com fallbacks automáticos

---

## 💻 Execução Local

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build

# 4. Iniciar servidor local de produção
npm start
```
