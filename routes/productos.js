const express = require('express');
const productoSchema = require('../models/producto');

const router = express.Router();
const authJwt = require('../src/middlewares/authJwt');

const indexSchema = require('../models/Indice');


// Crear producto
router.post('/producto', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    const tipo = req.body.tipo;

    let sufijo = "";

    switch (tipo) {
        case "playera":
            sufijo = "PL"
            break;
        case "sudadera":
            sufijo = "SD"
            break;
        case "llavero":
            sufijo = "LL"
            break;
        case "poster":
            sufijo = "PO"
            break;
        case "pin":
            sufijo = "PI"
            break;
        default:
            break;
    }

    const indiceProductos = await indexSchema.findOne({name: sufijo})

    // Incrementar el conteo
    indiceProductos.count += 1;

    // Guardar el cambio en la base de datos
    await indiceProductos.save();

    req.body.idItem = `${sufijo}-${(indiceProductos.count)}`


    const product = productoSchema(req.body);
    product.save()
        .then((data) => res.json(data))
        .catch((err) => res.status(403).json({ message: err }));
});

// Actualizar un producto
router.put('/producto/:id', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
    const { id } = req.params;
    const { title, anime, img, price, stock, tipo, tallas } = req.body


    let sufijo = "";

    switch (tipo) {
        case "playera":
            sufijo = "PL"
            break;
        case "sudadera":
            sufijo = "SD"
            break;
        case "llavero":
            sufijo = "LL"
            break;
        case "poster":
            sufijo = "PO"
            break;
        case "pin":
            sufijo = "PI"
            break;
        default:
            break;
    }
    
    const productFound = await productoSchema.findOne({idItem: id})

    let idItem = "";


    if(tipo !== productFound.tipo){
        const indiceProductos = await indexSchema.findOne({name: sufijo})

        // Incrementar el conteo
        indiceProductos.count += 1;
    
        // Guardar el cambio en la base de datos
        await indiceProductos.save();
    
        idItem = `${sufijo}-${(indiceProductos.count)}`
    }
    else{
        idItem = productFound.idItem;
    }

    productoSchema.updateOne({ idItem: id }, { $set: { title, anime, img, price, stock, idItem, tipo, tallas } })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener todos los productos
router.get('/producto', (req, res) => {
    productoSchema.find({eliminado: false}).sort({createdAt: -1})
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener un producto
router.get('/producto/:id', (req, res) => {
    const { id } = req.params;
    productoSchema.findOne({ idItem: id, eliminado: false })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener productos por categoria
router.get('/producto/tipo/:categoria', (req, res) => {
    const { categoria } = req.params;
    productoSchema.find({ tipo: categoria, eliminado: false })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener productos por anime
router.get('/producto/anime/:anime', (req, res) => {
    const { anime } = req.params;
    const palabras = anime.split(" ");

    for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1);
    }

    const animeCorregido = palabras.join(" ");

    console.log(animeCorregido);
    productoSchema.find({ anime: animeCorregido, eliminado: false })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Buscar por nombre y anime
router.get('/search/:busqueda', (req, res) => {
    const { busqueda } = req.params;
    console.log(busqueda);
    const regex = new RegExp(busqueda, 'i') // i for case insensitive
    productoSchema.find({$or: [{title: {$regex: regex}}, {anime: {$regex: regex}}, {idItem: {$regex: regex}},], eliminado: false})
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener lista de animes que hay de producto
router.get('/listanimes', (req, res) => {
    productoSchema.find({eliminado: false}).select('anime -_id')
        .then((data) => {
            let set = new Set(data.map(JSON.stringify));
            let dataSinDuplicaciones = Array.from(set).map(JSON.parse);
            res.json(dataSinDuplicaciones);
        })
        .catch((err) => res.json({ message: err }));
});

// Borrar un producto
router.delete('/producto/:id', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    const { id } = req.params;
    productoSchema.remove({ idItem: id })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Borrar un producto
router.put('/eliminar/productos', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
    const { productos } = req.body;

    try {
        productos.forEach(async item => {
            // Utiliza el método findByIdAndUpdate para actualizar un libro por su ID
            const resultado = await productoSchema.findByIdAndUpdate(item._id, { $set: { eliminado: true } });
    
            if (resultado) {
                console.log(`Producto con ID ${item._id} modificado.`);
            } else {
                console.log(`Producto con ID ${item._id} no encontrado.`);
            }
        });
    
        res.status(200).json({ message: "Productos eliminados" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: err })
    }
});





module.exports = router;