const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/User');
const Role = require('../models/Role');

const verify = require('../src/middlewares/verifySignup');

router.post('/signUP', [verify.checkDuplicateUser, verify.checkRolesExisted], async (req, res) => {
    const { username, email, password} = req.body;

    const newUser = new userSchema({
        username,
        email,
        password: await userSchema.encryptPassword(password)
    })

    const role = await Role.findOne({name: "user"});
    newUser.roles = [role._id];


    const savedUser = await newUser.save()
    .then(data => {
        console.log(data);
        const token = jwt.sign({id: data._id}, process.env.JWT_KEY, {
            expiresIn: 86400
        })
        res.json({token: token, user: data})
        
    })
    .catch((err) => {
        res.json(err);
    });
    
})

router.post('/signin', async (req, res) => {

    const userFound = await userSchema.findOne({email: req.body.email}).populate("roles")

    if(!userFound){
        return res.status(400).json({message: "Usuario no registrado"}) 
    }

    const matchPass = await userSchema.comparePassword(req.body.password, userFound.password);

    if(!matchPass){
        return res.status(400).json({token: null, message: "Contraseña incorrecta"}) 
    }

    const token = jwt.sign({id: userFound._id}, process.env.JWT_KEY, {
        expiresIn: 86400
    })

    res.json({token: token, user: userFound})

})

router.post('/signin/admin', async (req, res) => {

    const userFound = await userSchema.findOne({email: req.body.email}).populate("roles")

    if(!userFound){
        console.log("XD")
        return res.status(400).json({error: "Usuario no registrado"}) 
    }


    if(userFound.roles.find(role => role.name === "admin")){
        const matchPass = await userSchema.comparePassword(req.body.password, userFound.password);

        if(!matchPass){
            console.log("XD")
            return res.status(400).json({token: null, error: "Contraseña incorrecta"}) 
        }
    
        const token = jwt.sign({id: userFound._id}, process.env.JWT_KEY, {
            expiresIn: 86400
        })
    
        res.json({token: token, user: userFound})
    }
    else{
        return res.status(403).json({error: "No es admin"})
    }
})

module.exports = router;