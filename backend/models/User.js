const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    isAdmin: { type: Boolean, default: false } // Para separar cliente de administrador
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);