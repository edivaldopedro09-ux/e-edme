const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IMPORTANTE: Importar o middleware de verificação que criamos antes
const { verificarAdmin } = require('../middlewares/auth');

// --- REGISTRO DE USUÁRIO COMUM ---
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(req.body.senha, salt);

        const novoUsuario = new User({
            nome: req.body.nome,
            email: req.body.email,
            senha: senhaCriptografada,
            isAdmin: false // Garantimos que usuário comum não é admin
        });

        const usuarioSalvo = await novoUsuario.save();
        res.status(201).json(usuarioSalvo);
    } catch (err) {
        console.error("Erro no Registro:", err);
        res.status(500).json({ error: "Erro ao registrar usuário", detalhes: err.message });
    }
});

// --- REGISTRO DE NOVO ADMIN (Apenas um Admin pode criar outro) ---
router.post('/register-admin', verificarAdmin, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(req.body.senha, salt);

        const novoAdmin = new User({
            nome: req.body.nome,
            email: req.body.email,
            senha: senhaCriptografada,
            isAdmin: true 
        });

        const salvo = await novoAdmin.save();
        res.status(201).json({ message: "Novo administrador criado!", user: salvo.nome });
    } catch (err) {
        console.error("Erro no Registro Admin:", err);
        res.status(500).json({ error: "Erro ao criar admin", detalhes: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        // 1. Busca o usuário
        const usuario = await User.findOne({ email: req.body.email });
        if (!usuario) return res.status(401).json("Email ou senha incorretos!");

        // 2. Compara a senha
        const senhaValida = await bcrypt.compare(req.body.senha, usuario.senha);
        if (!senhaValida) return res.status(401).json("Email ou senha incorretos!");

        // 3. Verifica se existe o segredo no .env
        if (!process.env.JWT_SECRET) {
            console.error("ERRO: JWT_SECRET não definido no arquivo .env");
            return res.status(500).json("Erro de configuração no servidor.");
        }

        // 4. Cria o Token
        const token = jwt.sign(
            { id: usuario._id, isAdmin: usuario.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // 5. Retorna dados (removendo a senha por segurança)
        const { senha, ...outrosDados } = usuario._doc;
        res.status(200).json({ ...outrosDados, token });
        
    } catch (err) {
        console.error("Erro no Login:", err);
        res.status(500).json({ error: "Erro interno no servidor", detalhes: err.message });
    }
});

module.exports = router;