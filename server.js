const express = require('express');
const mogoose = require('mongoose');
const app = express();


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

app.use('/api', rutaProducto);

app.get('/', (req, res) => {
    res.end("Sevidor arekku tienda")
})

//Configurando server
app.listen(5000, () => {
    console.log("El servidor está corriendo correctamente jejeje");
})
