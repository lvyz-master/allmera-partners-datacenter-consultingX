import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { AllmeraLogo } from './AllmeraLogo';

interface AccessGateProps {
  onLoginSuccess: (username: string) => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials (case-insensitive for username 'Allmera', exact for password '12345')
      const validUser = username.trim().toLowerCase() === 'allmera';
      const validPass = password.trim() === '12345';

      if (validUser && validPass) {
        setIsLoading(false);
        onLoginSuccess('Allmera');
      } else {
        setIsLoading(false);
        setError('Usuário ou senha incorretos. Verifique suas credenciais de acesso corporativo.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Subtle executive ambient grid background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-[130px]" />
        <div className="absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[140px]" />
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top micro bar */}
      <header className="relative z-10 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AllmeraLogo size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Portal Corporativo Seguro
          </span>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-auto">
        <div className="w-full max-w-md">
          {/* Card container */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/50 space-y-6">
            {/* Header within card */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AllmeraLogo size="xl" />
              </div>

              <div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Acesse a plataforma corporativa de inteligência de infraestrutura, modelagem de TCO e análise de rede elétrica das Américas.
                </p>
              </div>
            </div>

            {/* Error Message if wrong */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">Acesso não autorizado</p>
                  <p className="text-[11px] leading-relaxed text-rose-700">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="username">
                  Usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário corporativo"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 text-sm transition-all shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/25 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Validando credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>Acessar Plataforma</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick overview of consultative modules available inside */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Módulos de Consultoria Integrados:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Mapa Continental</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Huawei vs Concorrentes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Simulador Elétrico 120MW</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Pareceres de IA Gemini</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ambiente Restrito & Confidencial</span>
            </p>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Allmera Partners Data Center Consulting
            </p>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-slate-100 bg-white/60 py-3 text-center text-[11px] text-slate-400">
        Allmera Partners Data Center Consulting · Infraestrutura Elétrica, TCO & Sustentabilidade nas Américas
      </footer>
    </div>
  );
};
