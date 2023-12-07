const express = require('express');
const router = express.Router();
const authJwt = require('../src/middlewares/authJwt');
const pedidoSchema = require('../models/pedido');

// Crear pedido de producto
router.post('/producto', [authJwt.verifyToken], async (req, res) => {
    const newPedido = new pedidoSchema(req.body);
    newPedido.save()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json({ message: err }));
});

router.get('/producto/:id', [authJwt.verifyToken], (req, res) => {
    const { id } = req.params;

    pedidoSchema.findOne({ _id: id })
        .populate('productos.producto')
        .populate('usuario')
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({ message: err }));
});


module.exports = router;