'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (!userJson) {
      router.push('/login');
    } else {
      setUsuario(JSON.parse(userJson));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Cabeçalho do Perfil */}
      <div className="bg-blue-700 pt-12 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-blue-600 shadow-xl">
            <User size={48} className="text-blue-700" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Olá, {usuario.nome}!</h1>
          <p className="text-blue-100 opacity-80 text-sm mt-1">Membro E-Edme desde 2024</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-[-60px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Menu Lateral */}
          <div className="space-y-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <nav className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm">
                  <div className="flex items-center gap-3"><Package size={18} /> Minhas Encomendas</div>
                  <ChevronRight size={16} />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition">
                  <div className="flex items-center gap-3"><MapPin size={18} /> Endereço de Entrega</div>
                  <ChevronRight size={16} />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition">
                  <div className="flex items-center gap-3"><ShieldCheck size={18} /> Segurança</div>
                  <ChevronRight size={16} />
                </button>
                <hr className="my-4 border-slate-100" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition"
                >
                  <LogOut size={18} /> Terminar Sessão
                </button>
              </nav>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Card de Informações */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                Informações da Conta
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                  <p className="text-slate-800 font-bold">{usuario.nome}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail de Contacto</label>
                  <p className="text-slate-800 font-bold">{usuario.email}</p>
                </div>
              </div>
            </div>

            {/* Simulação de Histórico */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 italic">Últimas Atividades</h2>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <ShoppingBag size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium text-sm">
                  Ainda não finalizou compras pelo site?<br />
                  As suas encomendas via WhatsApp aparecerão aqui em breve.
                </p>
                <Link href="/" className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition">
                  Ir às Compras
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}