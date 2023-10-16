const mongoose = require("mongoose");

const pedidoSchema = mongoose.Schema({
    costoTotal: {
        type: Number,
        required: true
    },
    productos: [{
        producto: {
            ref: "Producto",
            type: mongoose.Schema.Types.ObjectId
        },
        cantidad: {
            type: Number,
            required: true
        },
        talla: {
            type: String
        },
    }],
    estado: {
        type: String,
        required: true
    },
    usuario: {
        ref: "Usuario",
        type: mongoose.Schema.Types.ObjectId 
    }
},  { timestamps: true });

module.exports = mongoose.model("Pedido", pedidoSchema);