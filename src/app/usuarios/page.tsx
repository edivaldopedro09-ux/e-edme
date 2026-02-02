'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { ShieldCheck, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CadastroAdminPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [status, setStatus] = useState({ tipo: '', texto: '' });

  const handleCadastroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register-admin', { nome, email, senha });
      setStatus({ tipo: 'sucesso', texto: `Administrador ${nome} criado com sucesso!` });
      setNome(''); setEmail(''); setSenha('');
    } catch (err) {
      setStatus({ tipo: 'erro', texto: 'Erro. Verifique se você tem permissão de Admin.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Link href="/admin" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={18} /> Voltar ao Painel
      </Link>

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-center text-white">
          <ShieldCheck size={48} className="mx-auto mb-2 text-blue-400" />
          <h1 className="text-xl font-bold">Novo Administrador</h1>
          <p className="text-slate-400 text-sm">Conceda acesso total à loja</p>
        </div>

        <form onSubmit={handleCadastroAdmin} className="p-8 space-y-4">
          {status.texto && (
            <div className={`p-3 rounded-lg text-sm text-center font-medium ${
              status.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.texto}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Ex: João Admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail Corporativo</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="admin@loja.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha de Acesso</label>
            <input 
              type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <UserPlus size={20} /> Criar Administrador
          </button>
        </form>
      </div>
    </div>
  );
}