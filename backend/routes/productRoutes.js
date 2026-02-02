const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verificarAdmin } = require('../middlewares/auth');

// 1. Rota para cadastrar um produto (POST)
router.post('/add', verificarAdmin, async (req, res) => {
    try {
        const novoProduto = new Product(req.body);
        const salvo = await novoProduto.save();
        res.status(201).json(salvo);
    } catch (err) {
        // Detalhes extras no erro para sabermos o que o Mongo recusou
        res.status(400).json({ error: "Erro ao salvar produto", detalhes: err.message });
    }
});

// 2. Rota para listar todos os produtos (GET)
router.get('/', async (req, res) => {
    try {
        const produtos = await Product.find();
        res.status(200).json(produtos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
}); // <-- Chave fechada corretamente aqui

// 3. Rota para ATUALIZAR um produto (PUT) - ADICIONADA
router.put('/:id', verificarAdmin, async (req, res) => {
    try {
        const produtoAtualizado = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ message: "Produto não encontrado para atualizar!" });
        }

        res.status(200).json(produtoAtualizado);
    } catch (err) {
        res.status(400).json({ error: "Erro ao atualizar produto", detalhes: err.message });
    }
});

// 4. Rota para buscar um produto específico pelo ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const produto = await Product.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado!" });
        }
        res.status(200).json(produto);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar o produto", detalhes: err.message });
    }
});

// 5. Rota para deletar um produto (DELETE)
router.delete('/:id', verificarAdmin, async (req, res) => {
    try {
        const removido = await Product.findByIdAndDelete(req.params.id);
        if (!removido) {
            return res.status(404).json({ error: "Produto não encontrado!" });
        }
        res.status(200).json("Produto excluído com sucesso!");
    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir produto", detalhes: err.message });
    }
});

module.exports = router;