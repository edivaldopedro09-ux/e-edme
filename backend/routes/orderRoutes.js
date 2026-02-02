const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// 1. CRIAR PEDIDO (POST /api/orders/create)
// Ajustado para bater com o axios.post('/orders/create')
router.post('/create', verificarToken, async (req, res) => {
    try {
        const novoPedido = new Order({
            ...req.body,
            usuarioId: req.user.id // Sobrescreve por segurança com o ID do Token
        });

        const pedidoSalvo = await novoPedido.save();
        res.status(201).json(pedidoSalvo);
    } catch (err) {
        console.error("Erro ao criar pedido:", err);
        res.status(500).json({ mensagem: "Erro ao processar pedido", erro: err });
    }
});

// 2. VER PEDIDOS DO USUÁRIO LOGADO (GET /api/orders/user/:id)
// Ajustado para a página "Meus Pedidos" do cliente
router.get('/user/:id', verificarToken, async (req, res) => {
    try {
        // Por segurança, verificamos se o ID solicitado é o mesmo do token
        // (Ou se o requisitante é um Admin)
        if (req.params.id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ mensagem: "Acesso negado." });
        }

        const pedidos = await Order.find({ usuarioId: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. VER TODOS OS PEDIDOS (GET /api/orders/all)
// Ajustado para o seu Painel Admin de Validação
router.get('/all', verificarAdmin, async (req, res) => {
    try {
        const pedidos = await Order.find()
            .populate('usuarioId', 'nome email')
            .sort({ createdAt: -1 });
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. ATUALIZAR STATUS DO PEDIDO (PUT /api/orders/status/:id)
// Rota essencial para você clicar em "Validar Pagamento" no Admin
router.put('/status/:id', verificarAdmin, async (req, res) => {
    try {
        const pedidoAtualizado = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { status: req.body.status } },
            { new: true }
        );
        res.status(200).json(pedidoAtualizado);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;