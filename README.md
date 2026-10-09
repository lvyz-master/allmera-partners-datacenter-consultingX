# Allmera Partners Data Center Consulting

Plataforma executiva de inteligência e modelagem para desenvolvimento de Data Centers de IA nas Américas: análise de infraestrutura elétrica, sustentabilidade, fornecedores (Huawei vs. Schneider vs. Vertiv vs. Eaton) e viabilidade Capex/Opex.

---

## 🚀 Como Conectar este Projeto ao GitHub

Para conectar este projeto a um repositório no seu GitHub, siga os passos abaixo:

### Passo 1: Criar um Repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login.
2. Clique no botão **New** (ou acesse [github.com/new](https://github.com/new)).
3. Defina um nome para o repositório (exemplo: `allmera-partners-datacenter-consulting`).
4. Escolha se deseja torná-lo **Público** ou **Privado**.
5. **Atenção:** Deixe desmarcada a opção de inicializar com README ou .gitignore (pois este projeto já contém).
6. Clique em **Create repository**.

---

### Passo 2: Exportar ou Baixar os Arquivos
Você pode exportar/baixar o código diretamente da interface do AI Studio Build ou clonar caso esteja trabalhando localmente:
- Faça o download do arquivo ZIP do projeto através da interface do AI Studio Build (ícone de menu/download do código).
- Descompacte o arquivo no seu computador.

---

### Passo 3: Inicializar o Git e Enviar para o GitHub (Terminal)
Abra o terminal na pasta descompactada do projeto e execute os comandos:

```bash
# 1. Inicializar o repositório Git local
git init

# 2. Adicionar todos os ficheiros (o .gitignore já protegerá node_modules e segredos)
git add .

# 3. Fazer o primeiro commit
git commit -m "feat: initial commit - Allmera Partners Data Center Consulting platform"

# 4. Definir a branch principal como main
git branch -M main

# 5. Adicionar a URL remota do repositório criado no GitHub
# (Substitua SEU-USUARIO e SEU-REPOSITORIO pelos dados do seu GitHub)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 6. Enviar o código para o GitHub
git push -u origin main
```

> **Dica se preferir SSH:**  
> Se você utiliza chaves SSH no GitHub, utilize:  
> `git remote add origin git@github.com:SEU-USUARIO/SEU-REPOSITORIO.git`

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti
- **Backend / API Proxy:** Node.js, Express, TSX
- **Build Tool:** Vite
- **Inteligência:** Google GenAI SDK (Gemini)

---

## 💻 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Iniciar servidor de produção
npm start
```
