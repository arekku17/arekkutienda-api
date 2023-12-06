const express = require('express');
const router = express.Router();
const authJwt = require('../src/middlewares/authJwt');
const { uploadS3 } = require('../src/libs/setupS3');


router.post("/upload", [authJwt.verifyToken, authJwt.isAdmin, uploadS3.single('image')], (req, res) => {
    console.log(req)
    
    const {
        key, //Nombre guardado en el bucket
        location //URL de la imágen guardada en el bucket
    } = req.file;

    res.status(200).json({url: location, archivoNombre: key})
})


module.exports = router;