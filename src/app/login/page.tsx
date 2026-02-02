'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Mail, Lock, Chrome, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const res = await api.post('/auth/login', { email, senha });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data));
      
      router.push('/');
      router.refresh(); 
    } catch (err: any) {
      setErro('Os dados de acesso não coincidem com os nossos registos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redireciona para a rota do seu backend que lida com Google OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        
        {/* Logo e Boas-vindas */}
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-700 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">E-EDME.</h1>
          <p className="text-slate-500 font-medium mt-2">Bem-vindo de volta! Faça login na sua conta.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
          
          {erro && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold">
              <AlertCircle size={18} />
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  placeholder="exemplo@email.com" 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center ml-4 mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Palavra-passe</label>
                <Link href="/recuperar" className="text-[10px] font-black text-blue-600 uppercase hover:underline">Esqueceu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={carregando}
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-70"
            >
              {carregando ? 'A entrar...' : 'Entrar na conta'}
              {!carregando && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400"><span className="bg-white px-4">Ou continuar com</span></div>
          </div>

          {/* Google Login */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-100 text-slate-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
          >
            <Chrome className="text-blue-600" size={20} />
            Google
          </button>
        </div>

        {/* Link de Cadastro */}
        <p className="text-center mt-8 text-slate-500 font-medium">
          Ainda não tem conta na E-Edme?{' '}
          <Link href="/cadastro" className="text-blue-600 font-black hover:underline underline-offset-4">
            Criar conta agora
          </Link>
        </p>
      </div>
    </div>
  );
}