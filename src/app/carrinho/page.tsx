'use client';
import { useCart } from '@/context/CartContext';
import { Trash2, MessageCircle, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function CarrinhoPage() {
  const cartContext = useCart();
  
  // CORREÇÃO AQUI: 'as any[]' impede o erro de "type never" no build
  const { 
    cart = [] as any[], 
    removeFromCart = () => {}, 
    cartTotal = 0, 
    clearCart = () => {} 
  } = cartContext || {};

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-AO', { 
      style: 'currency', 
      currency: 'AOA' 
    }).replace('AOA', 'Kz');
  };

  const handleWhatsAppCheckout = async () => {
    const usuarioJson = localStorage.getItem('usuario');
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;

    if (!usuario) {
      alert("Por favor, faça login na E-Edme para finalizar a sua encomenda.");
      return router.push('/login');
    }

    setLoading(true);

    try {
      const payload = {
        usuarioId: usuario.id || usuario._id,
        // CORREÇÃO AQUI: Tipagem explícita (item: any) para o map
        produtos: cart.map((item: any) => ({
          produtoId: item._id,
          quantidade: item.quantity,
          precoUnitario: item.preco
        })),
        valorTotal: cartTotal,
        endereco: { localidade: "Luanda", nota: "Pedido via Web" },
        status: 'pendente'
      };

      const response = await api.post('/orders/create', payload);
      const pedidoId = response.data._id;

      const listaProdutos = cart.map((item: any) => 
        `• *${item.nome}* (Qtd: ${item.quantity}) - ${formatarMoeda(item.preco * item.quantity)}`
      ).join('%0A');

      const seuNumero = "244958922590";
      const saudacao = `Olá *E-Edme*! 👋%0AMeu nome é *${usuario.nome}*.%0A%0A*PEDIDO Nº: ${pedidoId.slice(-6).toUpperCase()}*%0A%0AGostaria de confirmar a seguinte encomenda:%0A%0A`;
      const totalMsg = `%0A%0A*Total Geral: ${formatarMoeda(cartTotal)}*%0A%0A---%0A_Acabei de gerar o pedido no site. Aguardo instruções para o pagamento._`;

      const url = `https://wa.me/${seuNumero}?text=${saudacao}${listaProdutos}${totalMsg}`;

      window.open(url, '_blank');
      
      clearCart();
      router.push('/confirmacao');
      
    } catch (err: any) {
      console.error("Erro no Checkout:", err);
      if (err.response?.status === 404) {
        alert("Erro 404: A rota de pedidos não foi encontrada no servidor.");
      } else {
        alert("Erro ao processar o seu pedido. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="bg-slate-50 p-8 rounded-full mb-6">
          <ShoppingBag size={64} className="text-slate-200" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">O seu carrinho está vazio</h1>
        <p className="text-slate-500 mt-2 mb-8">Parece que ainda não escolheu os seus produtos favoritos.</p>
        <Link href="/" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
          <ArrowLeft size={20} /> Começar a Comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">O Meu Carrinho<span className="text-blue-700">.</span></h1>
        <p className="text-slate-500 font-medium">Tem {cart.length} item(ns) selecionado(s)</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: any) => (
            <div key={item._id} className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.imagemUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.nome} />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tight">{item.nome}</h3>
                <p className="text-blue-700 font-bold mt-1 text-lg">{formatarMoeda(item.preco)}</p>
                <div className="inline-flex items-center gap-2 mt-3 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantidade:</span>
                  <span className="text-sm font-black text-slate-800">{item.quantity}</span>
                </div>
              </div>

              <button 
                onClick={() => removeFromCart(item._id)} 
                className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm group"
              >
                <Trash2 size={22} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          ))}
          
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors mt-6">
             <ArrowLeft size={16} /> Continuar a comprar
          </Link>
        </div>

        <aside className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShoppingBag size={140} />
            </div>
            
            <h2 className="text-xl font-black mb-6 border-b border-white/10 pb-4 italic">Resumo da Ordem</h2>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatarMoeda(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span>Entrega (Luanda)</span>
                <span className="text-green-400 font-black">A COMBINAR</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-black uppercase text-slate-400">Total Final</span>
                <span className="text-3xl font-black text-blue-400 tracking-tighter">
                  {formatarMoeda(cartTotal)}
                </span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppCheckout}
              disabled={loading}
              className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl active:scale-95 relative z-10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
              {loading ? 'Processando...' : 'Finalizar no WhatsApp'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}