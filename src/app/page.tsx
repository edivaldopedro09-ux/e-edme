'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { LayoutGrid, Smartphone, Shirt, Watch, Laptop, Coffee, Sparkles, Search, X } from 'lucide-react';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  const categorias = [
    { nome: 'Todos', icone: <LayoutGrid size={20} /> },
    { nome: 'Eletrónicos', icone: <Smartphone size={20} /> },
    { nome: 'Informática', icone: <Laptop size={20} /> },
    { nome: 'Moda', icone: <Shirt size={20} /> },
    { nome: 'Acessórios', icone: <Watch size={20} /> },
    { nome: 'Eletrodomésticos', icone: <Coffee size={20} /> },
  ];

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        setProdutos(res.data);
        setProdutosFiltrados(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos", err);
        setCarregando(false);
      });
  }, []);

  // Lógica Combinada: Filtro por Categoria + Busca por Nome
  useEffect(() => {
    let resultado = produtos;

    // Filtro por categoria
    if (categoriaAtiva !== 'Todos') {
      resultado = resultado.filter((p: any) => 
        p.categoria?.toLowerCase() === categoriaAtiva.toLowerCase()
      );
    }

    // Filtro por termo de busca
    if (termoBusca.trim() !== '') {
      resultado = resultado.filter((p: any) => 
        p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }

    setProdutosFiltrados(resultado);
  }, [categoriaAtiva, termoBusca, produtos]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de Destaque com Barra de Pesquisa */}
      <section className="bg-blue-700 pt-16 pb-24 px-4 mb-[-40px]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter italic">
            E-EDME<span className="text-blue-300">.</span>
          </h1>
          
          {/* BARRA DE PESQUISA CENTRAL */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text"
              placeholder="Pesquisar produtos na E-Edme (ex: iPhone, Nike...)"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full bg-white text-slate-900 py-5 pl-14 pr-12 rounded-2xl shadow-2xl outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium text-lg"
            />
            {termoBusca && (
              <button 
                onClick={() => setTermoBusca('')}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Barra de Categorias */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-blue-600 font-bold" size={20} />
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Navegar por Categoria</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categorias.map((cat) => (
              <button
                key={cat.nome}
                onClick={() => setCategoriaAtiva(cat.nome)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border-2
                  ${categoriaAtiva === cat.nome 
                    ? 'bg-blue-700 border-blue-700 text-white scale-105 shadow-xl shadow-blue-200' 
                    : 'bg-white border-transparent text-slate-500 hover:border-blue-200 hover:text-blue-700'
                  }`}
              >
                {cat.icone}
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Listagem de Resultados */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
            {termoBusca ? `Resultados para "${termoBusca}"` : (categoriaAtiva === 'Todos' ? 'Nossos Produtos' : categoriaAtiva)}
          </h2>
          <span className="text-xs font-black text-slate-400 bg-white border px-3 py-1.5 rounded-full shadow-sm">
            {produtosFiltrados.length} ENCONTRADOS
          </span>
        </div>

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <>
            {produtosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {produtosFiltrados.map((produto: any) => (
                  <ProductCard key={produto._id} produto={produto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Não encontramos nada</h3>
                <p className="text-slate-400 mt-2">Tente pesquisar por termos mais genéricos ou mude a categoria.</p>
                <button 
                  onClick={() => { setTermoBusca(''); setCategoriaAtiva('Todos'); }}
                  className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}