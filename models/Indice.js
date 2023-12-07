const mongoose = require("mongoose");

const indexSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    count: {
        type: Number,
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("Index", indexSchema);