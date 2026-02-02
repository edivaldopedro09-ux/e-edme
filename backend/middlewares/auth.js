const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // O token geralmente é enviado no cabeçalho "Authorization"
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // O padrão é "Bearer TOKEN_AQUI", então pegamos a segunda parte
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json("Token inválido ou expirado!");
            }
            // Salvamos os dados do usuário (id e isAdmin) na requisição
            req.user = user;
            next(); // Pode seguir para a rota original
        });
    } else {
        return res.status(401).json("Você não está autenticado!");
    }
};

// Middleware para verificar se o usuário é Administrador
const verificarAdmin = (req, res, next) => {
    verificarToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Acesso negado! Apenas administradores podem fazer isso.");
        }
    });
};

module.exports = { verificarToken, verificarAdmin };