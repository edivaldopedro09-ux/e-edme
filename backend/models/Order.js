const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    produtos: [
        {
            produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantidade: { type: Number, default: 1 },
            precoUnitario: { type: Number, required: true } // Preço congelado no ato da compra
        }
    ],
    valorTotal: { type: Number, required: true },
    endereco: { type: Object, required: true }, // Objeto contendo rua, cidade, cep...
    status: { type: String, default: "pendente" }, // pendente, pago, enviado, cancelado
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);