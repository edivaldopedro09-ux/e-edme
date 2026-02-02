'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, CreditCard, ArrowRight, shoppingBag, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmacaoPage() {
  const [copiado, setCopiado] = useState(false);
  const iban = "AO06 0000 0000 0000 0000 0000 0"; // Substitua pelo seu IBAN real

  const copiarIban = () => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ''));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        
        {/* Card Principal de Sucesso */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in zoom-in duration-500">
          
          <div className="bg-blue-700 p-10 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex justify-center items-center">
                <ShoppingBag size={200} />
            </div>
            <div className="relative z-10">
                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                    <CheckCircle2 size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter">Pedido Encaminhado!</h1>
                <p className="opacity-90 font-medium mt-2">Quase lá! Agora finalize o seu pagamento.</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            
            {/* Passo a Passo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px]">1</span>
                        Pagamento
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group">
                        <p className="text-[10px] font-black text-blue-600 mb-1">IBAN E-EDME (BAI)</p>
                        <p className="text-sm font-mono font-bold text-slate-700 break-all">{iban}</p>
                        <button 
                            onClick={copiarIban}
                            className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors"
                        >
                            <Copy size={14} /> {copiado ? 'Copiado!' : 'Copiar IBAN'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px]">2</span>
                        Confirmação
                    </h3>
                    <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                        <p className="text-xs text-green-700 font-medium leading-relaxed">
                            Envie o **comprovativo** no chat do WhatsApp que abriu. A nossa equipa validará o stock imediatamente.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Avisos Importantes */}
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><CreditCard size={20}/></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 italic">Aceitamos Multicaixa Express</p>
                        <p className="text-xs text-slate-500">Pagamento rápido e seguro direto pelo telemóvel.</p>
                    </div>
                </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                    href="/" 
                    className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-center hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    Continuar a Comprar <ArrowRight size={18} />
                </Link>
                <a 
                    href="https://wa.me/244958922590" 
                    target="_blank"
                    className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black text-center hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                >
                    <MessageCircle size={18} /> Voltar ao Chat
                </a>
            </div>

          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
            Obrigado por escolher a E-EDME. Sua confiança é o nosso motor.
        </p>
      </div>
    </div>
  );
}