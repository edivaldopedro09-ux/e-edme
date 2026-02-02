import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadados da loja (Importante para SEO em Angola)
export const metadata: Metadata = {
  title: 'E-Edme | A sua loja online em Angola',
  description: 'Os melhores produtos com entrega rápida em Luanda e todas as províncias. Compre com confiança na E-Edme.',
  keywords: 'e-commerce angola, compras online luanda, multicaixa express, loja virtual angola',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-ao">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <CartProvider>
          {/* O Header/Navbar fica fixo no topo */}
          <Navbar />
          
          {/* Conteúdo principal da página */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* O Rodapé com IBAN e contactos no final */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}