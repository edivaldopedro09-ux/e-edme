const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    imagemUrl: { type: String, required: true },
    // Alterado para ter um default, evitando erro 400 se esquecer de preencher
    categoria: { type: String, required: true, default: 'Geral' }, 
    estoque: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);