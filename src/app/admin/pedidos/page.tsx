'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, PackageCheck, User, 
  ArrowLeft, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Interfaces para melhorar a segurança do código
interface ProdutoItem {
  produtoId: { nome: string };
  quantidade: number;
  precoUnitario: number;
}

interface Pedido {
  _id: string;
  status: string;
  usuarioId?: { nome: string };
  createdAt: string;
  valorTotal: number;
  produtos: ProdutoItem[];
}

export default function GestaoPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const router = useRouter();

  // Helper para buscar o token de forma segura
  const getAuthHeader = () => {
    try {
      const user = JSON.parse(localStorage.getItem('usuario') || '{}');
      return {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
    } catch {
      return { headers: { Authorization: '' } };
    }
  };

  useEffect(() => {
    const verificarAcesso = () => {
      try {
        const user = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (!user || !user.isAdmin) {
          router.push('/');
        } else {
          setAutorizado(true);
          carregarPedidos();
        }
      } catch (err) {
        router.push('/');
      }
    };

    verificarAcesso();
  }, [router]);

  const carregarPedidos = async () => {
    try {
      const res = await api.get('/orders/all', getAuthHeader()); 
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
    } finally {
      setCarregando(false);
    }
  };

  const validarPagamento = async (id: string) => {
    if (window.confirm("Confirmas que o valor deste pedido já entrou na conta?")) {
      setProcessandoId(id);
      try {
        await api.put(`/orders/status/${id}`, { status: 'finalizado' }, getAuthHeader());
        await carregarPedidos(); // Atualiza a lista
      } catch (err) {
        alert("Erro ao validar pagamento. Verifique a permissão de administrador.");
      } finally {
        setProcessandoId(null);
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-AO', { 
      style: 'currency', 
      currency: 'AOA' 
    }).replace('AOA', 'Kz');
  };

  // Enquanto verifica o Admin ou carrega dados
  if (!autorizado || carregando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-700 mb-4" size={40} />
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">
          Sincronizando Pedidos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 hover:text-blue-600 transition-colors">
              <ArrowLeft size={16} /> Voltar ao Painel
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Validação de Compras<span className="text-blue-700">.</span>
            </h1>
            <p className="text-slate-500 font-medium">Controle de entradas financeiras.</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total em Fila</p>
            <p className="text-xl font-black text-slate-900">
              {pedidos.filter(p => p.status !== 'finalizado').length} Pendentes
            </p>
          </div>
        </header>

        <div className="space-y-6">
          {pedidos.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
              <PackageCheck size={64} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">Nenhuma encomenda registrada.</p>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div 
                key={pedido._id} 
                className={`bg-white rounded-[2.5rem] border-2 transition-all overflow-hidden ${
                  pedido.status === 'finalizado' 
                    ? 'border-transparent shadow-sm opacity-70' 
                    : 'border-blue-100 shadow-xl shadow-blue-50/50'
                }`}
              >
                <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
                        REF: {pedido._id.slice(-6).toUpperCase()}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        pedido.status === 'finalizado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {pedido.status === 'finalizado' ? 'Pago & Finalizado' : 'Aguardando Pagamento'}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase italic">
                        <User size={20} className="text-blue-600" /> {pedido.usuarioId?.nome || "Cliente Externo"}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                        Data: {new Date(pedido.createdAt).toLocaleDateString('pt-AO')} às {new Date(pedido.createdAt).toLocaleTimeString('pt-AO')}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                        {pedido.produtos && pedido.produtos.length > 0 ? (
                          pedido.produtos.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-bold text-slate-600 italic border-b border-slate-200 pb-2 last:border-0">
                              <span>{item.produtoId?.nome || "Item Indisponível"} <span className="text-blue-600 ml-2">x{item.quantidade}</span></span>
                              <span className="text-slate-900">{formatarMoeda(item.precoUnitario * item.quantidade)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold italic">
                            <AlertCircle size={14} /> Detalhes dos itens indisponíveis.
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-between items-end gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                    <div className="text-right w-full">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total do Pedido</p>
                      <p className="text-3xl font-black text-blue-700 tracking-tighter">{formatarMoeda(pedido.valorTotal)}</p>
                    </div>

                    {pedido.status !== 'finalizado' ? (
                      <button 
                        onClick={() => validarPagamento(pedido._id)}
                        disabled={processandoId === pedido._id}
                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {processandoId === pedido._id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            <CheckCircle size={18} className="group-hover:scale-110 transition-transform" /> 
                            Confirmar Recebimento
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                        <PackageCheck size={18} /> Pagamento Validado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}