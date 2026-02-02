const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const stripeRoute = require("./routes/stripe");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite que o servidor entenda JSON

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/stripe", stripeRoute);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
    .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Rota de teste
app.get('/', (req, res) => {
    res.send("API da Loja Virtual Rodando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});