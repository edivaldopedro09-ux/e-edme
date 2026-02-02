'use client';
import { ShoppingCart, User, LogOut, ShoppingBag, Menu, ShieldCheck, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const [usuario, setUsuario] = useState<{ nome: string; isAdmin?: boolean } | null>(null);

  // Calcula o total de itens no carrinho
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      setUsuario(JSON.parse(userJson));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex justify-between items-center">
        
        {/* LOGO E-EDME */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-700 p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-blue-100">
            <ShoppingBag className="text-white" size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
              E-EDME<span className="text-blue-700">.</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
              Angola Online
            </span>
          </div>
        </Link>

        {/* ACÇÕES DIREITA */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Link Admin */}
          {usuario?.isAdmin && (
            <Link 
              href="/admin" 
              className="hidden xl:flex items-center gap-2 text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              <ShieldCheck size={14} /> ADMIN
            </Link>
          )}

          {usuario ? (
            <div className="flex items-center gap-2 sm:gap-4 pl-4 border-l border-gray-100">
              
              {/* LINK: MEUS PEDIDOS */}
              <Link 
                href="/pedidos" 
                className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-700 transition p-2 hover:bg-slate-50 rounded-xl"
                title="Ver Encomendas"
              >
                <Package size={22} />
                <span className="text-xs font-black uppercase tracking-tight hidden lg:block">Pedidos</span>
              </Link>

              {/* LINK: VER PERFIL / MINHA CONTA */}
              <Link 
                href="/perfil" 
                className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-2xl transition group border border-transparent hover:border-blue-100"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <User size={20} />
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Minha Conta</span>
                  <span className="text-sm font-black text-slate-800 leading-none mt-1 flex items-center gap-1">
                    {usuario.nome.split(' ')[0]}
                    <ChevronDown size={12} className="text-slate-400" />
                  </span>
                </div>
              </Link>
              
              {/* LOGOUT */}
              <button 
                onClick={handleLogout}
                className="p-2.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-700 font-bold text-sm transition"
            >
              <div className="p-2 bg-slate-50 rounded-full group-hover:bg-blue-50">
                <User size={20} />
              </div>
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}

          {/* Carrinho */}
          <Link href="/carrinho" className="relative p-2.5 bg-blue-700 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 group">
            <ShoppingCart className="group-hover:scale-110 transition-transform" size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}