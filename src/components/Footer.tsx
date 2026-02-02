'use client';
import Link from 'next/link';
import { ShoppingBag, Instagram, Facebook, MessageCircle, Phone, Mail, MapPin, CreditCard } from 'lucide-react';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Coluna 1: Sobre a Marca */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              E-EDME<span className="text-blue-500">.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            A E-Edme é a sua nova referência em compras online em Angola. 
            Qualidade, confiança e entrega rápida em todas as províncias.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
            <a href={`https://wa.me/2449XXXXXXXXX`} className="hover:text-green-500 transition-colors"><MessageCircle size={20} /></a>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Navegação</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition">Início</Link></li>
            <li><Link href="/produtos" className="hover:text-white transition">Todos os Produtos</Link></li>
            <li><Link href="/carrinho" className="hover:text-white transition">Meu Carrinho</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Minha Conta</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Contactos & Localização */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contacto</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 flex-shrink-0" />
              <span>Luanda, Angola<br /><span className="text-xs text-slate-500">Viana / Talatona</span></span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500 flex-shrink-0" />
              <span>+244 9XX XXX XXX</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500 flex-shrink-0" />
              <span>geral@e-edme.com</span>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Pagamento (Importante em Angola) */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Pagamento</h3>
          <p className="text-xs mb-4 text-slate-500 italic">Aceitamos transferência e Multicaixa Express</p>
          <div className="space-y-3">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <p className="text-[10px] uppercase font-bold text-blue-500">IBAN E-EDME (BAI)</p>
              <p className="text-xs font-mono text-white mt-1">AO06 0055 0000 0008 9688 1016 5</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/10 p-2 rounded flex-1 flex justify-center items-center">
                <CreditCard size={16} className="mr-2" /> <span className="text-[10px] font-bold">MCX EXPRESS</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
        <p>© {anoAtual} EDME SOLUTIONS. Todos os direitos reservados.</p>
        <p>Desenvolvido por <span className="text-blue-600">Seu Nome</span></p>
      </div>
    </footer>
  );
}