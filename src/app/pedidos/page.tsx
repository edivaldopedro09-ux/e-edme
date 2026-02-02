'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Package, Clock, CheckCircle2, ShoppingBag, 
  ArrowLeft, Loader2, MapPin, CreditCard 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const usuarioJson = localStorage.getItem('usuario');
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : null;

    if (!usuario) {
      router.push('/login');
      return;
    }

    const carregarMeusPedidos = async () => {
      try {
        // Busca os pedidos usando o ID do usuário logado
        const res = await api.get(`/orders/user/${usuario.id || usuario._id}`);
        setPedidos(res.data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarMeusPedidos();
  }, [router]);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-AO', { 
      style: 'currency', 
      currency: 'AOA' 
    }).replace('AOA', 'Kz');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-700 mb-4" size={40} />
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-700 transition-colors mb-4">
          <ArrowLeft size={16} /> Voltar à Loja
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Minhas Encomendas<span className="text-blue-700">.</span></h1>
      </header>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-sm">
          <ShoppingBag className="mx-auto text-slate-200 mb-6" size={48} />
          <h2 className="text-xl font-black text-slate-800">Nenhum pedido encontrado</h2>
          <Link href="/" className="text-blue-700 font-bold text-sm mt-4 inline-block underline">Ir às compras</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido: any) => (
            <div key={pedido._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
                      ID: {pedido._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-sm font-bold text-slate-500 mt-2">
                      {new Date(pedido.createdAt).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase italic ${
                    pedido.status === 'finalizado' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {pedido.status === 'finalizado' ? 'Pagamento Validado' : 'Pendente'}
                  </div>
                </div>

                {/* LISTA DE PRODUTOS - CORRIGIDO PARA .produtos */}
                <div className="space-y-3 mb-8 bg-slate-50 p-6 rounded-2xl">
                  {pedido.produtos && pedido.produtos.length > 0 ? (
                    pedido.produtos.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-700 uppercase italic text-xs">
                          {item.produtoId?.nome || "Produto E-Edme"} <span className="text-slate-400 ml-2">x{item.quantidade}</span>
                        </span>
                        <span className="font-black text-slate-900">{formatarMoeda(item.precoUnitario * item.quantidade)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Detalhes dos itens indisponíveis</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                    <CreditCard size={14} /> IBAN / EXPRESS
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Pago</p>
                    <p className="text-2xl font-black text-blue-700 tracking-tighter mt-1">{formatarMoeda(pedido.valorTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}