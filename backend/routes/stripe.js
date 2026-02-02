const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY); // Certifique-se que STRIPE_KEY está no .env

router.post('/checkout', async (req, res) => {
    try {
        const { produtos } = req.body;

        // Criando a lista de itens formatada para o Stripe
        const line_items = produtos.map((item) => {
            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.nome,
                        images: [item.imagemUrl],
                    },
                    // O Stripe espera o valor em centavos (Ex: 10.50 -> 1050)
                    unit_amount: Math.round(item.preco * 100), 
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            // Certifique-se que essas URLs apontam para o seu frontend (localhost:3000)
            success_url: 'http://localhost:3000/sucesso',
            cancel_url: 'http://localhost:3000/carrinho',
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error("ERRO NO STRIPE:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;