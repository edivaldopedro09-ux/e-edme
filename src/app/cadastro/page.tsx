'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      await api.post('/auth/register', { nome, email, senha });
      // Sucesso! Redireciona com um parâmetro para mostrar aviso no login
      router.push('/login?cadastrado=true');
    } catch (err: any) {
      setErro('Não foi possível criar a conta. Verifique se o e-mail já está em uso.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-slate-50 py-12">
      <div className="w-full max-w-md">
        
        {/* Voltar */}
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-700 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Login
        </Link>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
          
          <div className="text-center mb-8">
            <div className="inline-flex bg-blue-50 p-4 rounded-2xl text-blue-700 mb-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Criar Conta na E-EDME</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">Junte-se a nós e aproveite as melhores ofertas em Angola.</p>
          </div>

          {erro && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {erro}
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-5">
            {/* Campo Nome */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-4">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Ex: Manuel dos Santos" 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required
                />
              </div>
            </div>

            {/* Campo E-mail */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-4">E-mail Profissional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  placeholder="exemplo@e-edme.com" 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-4">Definir Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={carregando}
                className="w-full bg-blue-700 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {carregando ? 'A criar conta...' : 'Finalizar Cadastro'}
                {!carregando && <CheckCircle2 size={20} />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium text-sm">
            Já faz parte da E-Edme?{' '}
            <Link href="/login" className="text-blue-700 font-black hover:underline underline-offset-4">
              Fazer Login
            </Link>
          </p>
        </div>

        {/* Termos e Privacidade (Rodapé discreto) */}
        <p className="text-center mt-8 text-[10px] text-slate-400 uppercase tracking-widest leading-loose">
          Ao cadastrar-se, concorda com os nossos <br />
          <span className="text-slate-600 underline">Termos de Serviço</span> e <span className="text-slate-600 underline">Privacidade</span>.
        </p>
      </div>
    </div>
  );
}