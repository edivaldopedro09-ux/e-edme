'use client';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductCard({ produto }: { produto: any }) {
  const { addToCart } = useCart();

  // Função para formatar o preço em Kwanzas
  const formatarKwanza = (valor: number) => {
    return valor.toLocaleString('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0, // Geralmente em Angola não usamos muito os cêntimos em lojas online
    }).replace('AOA', 'Kz'); // Garante que apareça Kz em vez do código ISO
  };

  return (
    <div className="group bg-white border rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Link na Imagem */}
      <Link href={`/produto/${produto._id}`} className="relative overflow-hidden rounded-xl block">
        <img 
          src={produto.imagemUrl} 
          alt={produto.nome} 
          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500" 
        />
        {/* Overlay de "Ver Detalhes" */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Eye size={16} /> Ver detalhes
          </span>
        </div>
      </Link>

      <div className="mt-4 flex flex-col flex-grow">
        {/* Link no Título */}
        <Link href={`/produto/${produto._id}`}>
          <h2 className="font-bold text-gray-800 text-lg hover:text-blue-600 transition-colors line-clamp-1">
            {produto.nome}
          </h2>
        </Link>
        
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
          {produto.descricao || 'Sem descrição disponível.'}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-blue-700">
            {formatarKwanza(produto.preco)}
          </span>
        </div>
        
        <button 
          onClick={() => addToCart(produto)}
          className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-green-600 transition-colors font-bold shadow-md active:scale-95"
        >
          <ShoppingCart size={18} /> Comprar agora
        </button>
      </div>
    </div>
  );
}