require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Verifique se o caminho do seu model está correto

const createFirstAdmin = async () => {
  try {
    // 1. Conectar ao Banco de Dados
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB para criar o Admin...");

    // 2. Dados do seu primeiro administrador (Edite aqui se quiser)
    const adminEmail = "admin@loja.com";
    const adminSenha = "123456"; // Mude depois que logar!

    // 3. Verificar se o admin já existe para não duplicar
    const existe = await User.findOne({ email: adminEmail });
    if (existe) {
      console.log("⚠️ O administrador já existe no banco de dados.");
      process.exit();
    }

    // 4. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(adminSenha, salt);

    // 5. Criar o usuário com isAdmin: true
    const novoAdmin = new User({
      nome: "Administrador Geral",
      email: adminEmail,
      senha: senhaCriptografada,
      isAdmin: true
    });

    await novoAdmin.save();
    
    console.log("--------------------------------------");
    console.log("🚀 ADMIN CRIADO COM SUCESSO!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminSenha}`);
    console.log("--------------------------------------");

  } catch (err) {
    console.error("❌ Erro ao criar admin:", err.message);
  } finally {
    // Fecha a conexão após terminar
    mongoose.connection.close();
  }
};

createFirstAdmin();