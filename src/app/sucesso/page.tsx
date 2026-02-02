'use client';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SucessoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpa o carrinho do estado e do localStorage após a compra
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <CheckCircle size={80} className="text-green-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Pagamento Confirmado!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Obrigado pela sua compra. Você receberá os detalhes no seu e-mail em breve.
      </p>
      <Link 
        href="/" 
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition duration-300"
      >
        Continuar Comprando
      </Link>
    </div>
  );
}