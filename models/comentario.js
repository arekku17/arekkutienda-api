const mongoose = require("mongoose");

const comentarioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    anime: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Boolean,
        required: true
    },
    idItem: {
        type: String,
        required: true
    },
    tallas: {
        type: Array
    },
    tipo: {
        type: String,
        required: true
    },
},  { timestamps: true });

module.exports = mongoose.model("Producto", comentarioSchema);