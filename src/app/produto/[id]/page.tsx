'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, BadgeCheck, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduto(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produto", err);
        setCarregando(false);
      });
  }, [id]);

  // Função para formatar moeda (Kwanza)
  const formatarKwanza = (valor: number) => {
    return valor.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).replace('AOA', 'Kz');
  };

  if (carregando) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="font-bold text-gray-500 text-lg italic">Carregando detalhes do produto...</p>
    </div>
  );

  if (!produto) return (
    <div className="p-20 text-center font-bold text-red-500">
      Produto não encontrado ou erro de conexão.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12">
      {/* Navegação de Volta */}
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-all font-medium">
        <ArrowLeft size={20} /> Voltar à Loja
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Galeria de Imagem */}
        <div className="sticky top-24">
          <div className="bg-white p-2 rounded-[2.5rem] border shadow-xl overflow-hidden group">
            <img 
              src={produto.imagemUrl} 
              alt={produto.nome} 
              className="w-full h-auto object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Informações de Compra */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {produto.categoria || 'Geral'}
            </span>
            <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
              <BadgeCheck size={14} /> Produto Autêntico
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            {produto.nome}
          </h1>
          
          <div className="flex flex-col mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-sm text-gray-500 mb-1">Preço unitário</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-blue-700">
                {formatarKwanza(produto.preco)}
              </span>
              <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                Disponível
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-3 underline decoration-blue-500 underline-offset-4">
              Descrição do Produto
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {produto.descricao}
            </p>
          </div>

          {/* Vantagens e Entrega (Foco Angola) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-start gap-3 p-4 bg-white border rounded-2xl">
              <Truck size={24} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-slate-800">Entrega rápida</p>
                <p className="text-xs text-gray-500">Luanda e arredores em 24h.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white border rounded-2xl">
              <ShieldCheck size={24} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-slate-800">Pagamento Seguro</p>
                <p className="text-xs text-gray-500">Referência ou Multicaixa.</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart(produto)}
              className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95"
            >
              <ShoppingCart size={22} /> Adicionar ao Carrinho
            </button>
            
            {/* Atalho rápido para dúvidas em Angola via WhatsApp */}
            <a 
              href={`https://wa.me/244958922590?text=Tenho interesse no produto: ${produto.nome}`}
              target="_blank"
              className="bg-green-600 text-white p-5 rounded-2xl flex items-center justify-center hover:bg-green-700 transition-all shadow-lg active:scale-95"
              title="Perguntar via WhatsApp"
            >
              <MessageCircle size={26} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}