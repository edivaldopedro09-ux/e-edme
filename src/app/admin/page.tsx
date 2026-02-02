'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  PackagePlus, LayoutDashboard, Trash2, RefreshCcw, 
  Box, ClipboardList, ArrowUpRight, ShoppingCart, LogOut, Edit3, XCircle, UploadCloud, ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// Definição de interface para o Produto
interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagemUrl: string;
  categoria?: string;
  estoque: number;
}

export default function AdminPage() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estoque, setEstoque] = useState('');
  
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro' | '', text: string }>({ tipo: '', text: '' });
  const [estatisticas, setEstatisticas] = useState({ totalProdutos: 0, totalVendas: 0 });
  
  const router = useRouter();

  const categoriasPredefinidas = [
    "Smartphones", "Computadores", "Acessórios", "Áudio", "Gaming", "Eletrodomésticos"
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMensagem({ tipo: 'erro', text: 'Imagem muito grande! Máximo 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAuthHeader = () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuario') || '{}');
      return {
        headers: { Authorization: `Bearer ${user.token}` }
      };
    }
    return { headers: { Authorization: '' } };
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!user.isAdmin) {
      router.push('/');
    } else {
      carregarProdutos();
    }
  }, [router]);

  const carregarProdutos = async () => {
    try {
      const res = await api.get('/products');
      setProdutos(res.data);
      setEstatisticas(prev => ({ ...prev, totalProdutos: res.data.length }));
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    }
  };

  const prepararEdicao = (p: Produto) => {
    setEditandoId(p._id);
    setNome(p.nome);
    setPreco(p.preco.toString());
    setDescricao(p.descricao);
    setImagemUrl(p.imagemUrl);
    setCategoria(p.categoria || '');
    setEstoque(p.estoque.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    limparCampos();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = getAuthHeader();
    const dadosProduto = {
      nome: nome.trim(),
      preco: Number(preco),
      descricao: descricao.trim(),
      imagemUrl,
      categoria: categoria || 'Geral',
      estoque: Number(estoque) || 0
    };

    try {
      if (editandoId) {
        await api.put(`/products/${editandoId}`, dadosProduto, config);
        setMensagem({ tipo: 'sucesso', text: 'Produto atualizado!' });
      } else {
        await api.post('/products/add', dadosProduto, config);
        setMensagem({ tipo: 'sucesso', text: 'Produto adicionado!' });
      }
      cancelarEdicao();
      carregarProdutos();
      setTimeout(() => setMensagem({ tipo: '', text: '' }), 3000);
    } catch (err: any) {
      setMensagem({ tipo: 'erro', text: 'Erro na operação.' });
    }
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Deseja eliminar este produto?")) {
      try {
        await api.delete(`/products/${id}`, getAuthHeader());
        setMensagem({ tipo: 'sucesso', text: 'Removido!' });
        carregarProdutos();
        setTimeout(() => setMensagem({ tipo: '', text: '' }), 3000);
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
  };

  const limparCampos = () => {
    setNome(''); setPreco(''); setDescricao(''); setImagemUrl(''); setCategoria(''); setEstoque('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl italic font-black text-xl">E</div>
          <h2 className="text-xl font-black tracking-tighter italic">ADMIN-EDME</h2>
        </div>
        <nav className="flex-1 space-y-8">
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-4">Principal</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 bg-blue-600/10 text-blue-400 p-3 rounded-xl font-bold">
                <LayoutDashboard size={20} /> Dashboard
              </li>
              <Link href="/admin/pedidos" className="flex items-center gap-3 text-slate-400 hover:text-white p-3 rounded-xl transition font-bold">
                <ClipboardList size={20} /> Validar Pedidos
              </Link>
            </ul>
          </div>
        </nav>
        <Link href="/" className="flex items-center gap-3 text-red-400 hover:bg-red-400/10 p-4 rounded-2xl transition font-bold mt-auto">
          <LogOut size={20} /> Sair
        </Link>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        {mensagem.text && (
          <div className={`mb-6 p-4 rounded-2xl font-bold text-center transition-all ${
            mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensagem.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-slate-100">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Catálogo</p>
              <h4 className="text-3xl font-black text-slate-900">{estatisticas.totalProdutos} Produtos</h4>
            </div>
            <Box className="text-blue-600" size={32} />
          </div>
          <Link href="/admin/pedidos" className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center justify-between border border-slate-100 hover:border-green-400 transition">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Vendas</p>
              <h4 className="text-3xl font-black text-slate-900 flex items-center gap-2">Ver Pedidos <ArrowUpRight /></h4>
            </div>
            <ShoppingCart className="text-green-600" size={32} />
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <section className="xl:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-xl border border-white h-fit">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
              {editandoId ? <Edit3 className="text-amber-500" /> : <PackagePlus className="text-blue-600" />}
              {editandoId ? 'Editar Produto' : 'Novo Registro'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Item</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition font-medium text-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Preço (Kz)</label>
                  <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition font-medium text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Qtd. Stock</label>
                  <input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition font-medium text-slate-900" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria</label>
                <div className="relative">
                  <select 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)} 
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition font-medium appearance-none cursor-pointer text-slate-900"
                  >
                    <option value="" disabled>Escolha uma categoria...</option>
                    {categoriasPredefinidas.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Foto do Produto</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer overflow-hidden">
                  {imagemUrl ? (
                    <>
                      <img src={imagemUrl} alt="Preview" className="w-full h-32 object-contain" />
                      <button type="button" onClick={() => setImagemUrl('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><XCircle size={16} /></button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={30} className="text-slate-300" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Clique para selecionar</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Descrição</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows={2} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition resize-none font-medium text-slate-900"></textarea>
              </div>

              <button type="submit" className={`w-full text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${editandoId ? 'bg-amber-500' : 'bg-slate-900 hover:bg-blue-600'}`}>
                {editandoId ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </form>
          </section>

          <section className="xl:col-span-7 space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><RefreshCcw className="text-blue-600" /> Inventário Geral</h3>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {produtos.map((p) => (
                <div key={p._id} className={`flex items-center justify-between p-4 bg-white rounded-[1.5rem] border transition-all ${editandoId === p._id ? 'border-amber-400 shadow-lg' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <img src={p.imagemUrl} alt={p.nome} className="w-14 h-14 object-cover rounded-xl shadow-sm" />
                    <div>
                      <h4 className="font-black text-slate-800 text-xs uppercase italic">{p.nome}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {p.categoria || 'Geral'}
                        </span>
                        <span className="text-[10px] font-black text-blue-600 italic">{Number(p.preco).toLocaleString('pt-AO')} Kz</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stock: {p.estoque}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => prepararEdicao(p)} className="p-2 text-slate-300 hover:text-amber-500 transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => handleExcluir(p._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}