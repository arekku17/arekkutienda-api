const express = require('express');
const productoSchema = require('../models/producto');

const router = express.Router();

// // Crear producto
// router.post('/producto', (req, res) => {
//     const product = productoSchema(req.body);
//     product.save()
//         .then((data) => res.json(data))
//         .catch((err) => res.json({ message: err }));
// });


// Obtener todos los productos
router.get('/producto', (req, res) => {
    productoSchema.find()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener un producto
router.get('/producto/:id', (req, res) => {
    const { id } = req.params;
    productoSchema.findOne({ idItem: id })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Actualizar un producto
router.put('/producto/:id', (req, res) => {
    const { id } = req.params;
    const { title, anime, img, price, stock } = req.body
    productoSchema.updateOne({ idItem: id }, { $set: { title, anime, img, price, stock } })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener productos por categoria
router.get('/producto/tipo/:categoria', (req, res) => {
    const { categoria } = req.params;
    productoSchema.find({ tipo: categoria })
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
    productoSchema.find({ anime: animeCorregido })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Buscar por nombre y anime
router.get('/search/:busqueda', (req, res) => {
    const { busqueda } = req.params;
    console.log(busqueda);
    const regex = new RegExp(busqueda, 'i') // i for case insensitive
    productoSchema.find({$or: [{title: {$regex: regex}}, {anime: {$regex: regex}}, {idItem: {$regex: regex}},]})
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
});

// Obtener lista de animes que hay de producto
router.get('/listanimes', (req, res) => {
    productoSchema.find().select('anime -_id')
        .then((data) => {
            let set = new Set(data.map(JSON.stringify));
            let dataSinDuplicaciones = Array.from(set).map(JSON.parse);
            res.json(dataSinDuplicaciones);
        })
        .catch((err) => res.json({ message: err }));
});

// // Borrar un producto
// router.delete('/producto/:id', (req, res) => {
//     const { id } = req.params;
//     productoSchema.remove({ idItem: id })
//         .then((data) => res.json(data))
//         .catch((err) => res.json({ message: err }));
// });

module.exports = router;