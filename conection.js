const mongoose = require('mongoose');
let MONGODB_URI = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/arekkutienda";

console.log(process.env.MONGODB_URL);

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.connect(MONGODB_URI);
mongoose.set('strictQuery', false);

const objetobd = mongoose.connection;
objetobd.on('connected', () => {console.log('Conexión correcta')});
objetobd.on('error', () => {console.log('Error en la conexión')});

module.exports = mongoose;