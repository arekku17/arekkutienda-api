const express = require('express');
const mogoose = require('mongoose');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const initialSetup = require('./src/libs/initialSetup');


require("dotenv").config();

// Importar conexión mongoDB
const archivoBD = require('./conection');

// Importación de rutas y modelo
const rutaProducto = require('./routes/productos');
const rutaAuth = require('./routes/auth.routes');
const rutaUser = require('./routes/user.routes');
const rutaPedido = require('./routes/pedido.routes');

//Importar body parser
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:'true'}));
app.use(cors());

app.use('/api', rutaProducto);
app.use('/api/auth', rutaAuth);
app.use('/api/users', rutaUser);
app.use('/api/pedido', rutaPedido);

initialSetup.createRoles();

app.get('/', (req, res) => {
    res.end("Sevidor arekku tienda")
})

//Configurando server
app.listen(process.env.PORT || 9000, () => {
    console.log("El servidor está corriendo correctamente uwu");
})
