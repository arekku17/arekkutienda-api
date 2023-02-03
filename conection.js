const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/arekkutienda');
mongoose.set('strictQuery', false);

const objetobd = mongoose.connection;
objetobd.on('connected', () => {console.log('Conexión correcta')});
objetobd.on('error', () => {console.log('Error en la conexión')});

module.exports = mongoose;