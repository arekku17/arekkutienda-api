const express = require('express');
const mogoose = require('mongoose');
const app = express();
const cors = require('cors');
require("dotenv").config();

// Importar conexión mongoDB
const archivoBD = require('./conection');

// Importación de rutas y modelo
const rutaProducto = require('./routes/productos');

//Importar body parser
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:'true'}));
app.use(cors({
    origin: 'https://arekku-tienda.onrender.com'
}));

app.use('/api', rutaProducto);

app.get('/', (req, res) => {
    res.end("Sevidor arekku tienda")
})

//Configurando server
app.listen(process.env.PORT || 5000, () => {
    console.log("El servidor está corriendo correctamente jejeje");
})
