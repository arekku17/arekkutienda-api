const express = require('express');
const User = require('../models/User');
const Role = require('../models/Role');

const router = express.Router();
const authJwt = require('../src/middlewares/authJwt');

const verify = require('../src/middlewares/verifySignup');

router.post('/', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verify.checkDuplicateUser,
    verify.checkRolesExisted
    ], async (req, res) => {
    const { username, email, password, roles } = req.body;

    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    })

    if(roles) {
        const foundRoles = await Role.find({name:{$in: roles}});
        newUser.roles = foundRoles.map(role => role._id);
    }
    else {
        const role = await Role.findOne({name: "user"});
        newUser.roles = [role._id];
    }

    const savedUser = await newUser.save()
    .then(data => {
        console.log(data);
        const token = jwt.sign({id: data._id}, process.env.JWT_KEY, {
            expiresIn: 86400
        })
        res.json({token})
        
    })
    .catch((err) => {
        res.json(err);
    });
})

router.put('/:nameuser', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verify.checkRolesExisted,
    verify.checkDuplicateUser
    ], async (req, res) => {
    const { username, email, password, roles } = req.body;

    const foundRoles = await Role.find({name:{$in: roles}});
    const idRoles = foundRoles.map(role => role._id);

    const { nameuser } = req.params;

    console.log(idRoles);

    await User.updateOne(
        { username: nameuser },
        { $set: { username: username, email: email, password: await User.encryptPassword(password), roles: idRoles } })
    .then(data => {
        res.json({data});
        
    })
    .catch((err) => {
        res.json(err);
    });
})


// Obtenemos todos los usuarios
router.get('/', [authJwt.verifyToken, authJwt.isModerador], async (req, res) => {
    User.find()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
})

// Obtener un usuario por su username
router.get('/:username', [authJwt.verifyToken, authJwt.isModerador], async (req, res) => {
    const { username } = req.params;
    User.findOne({ username: username })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
})

// Eliminar por el username
router.delete('/:username', [authJwt.verifyToken, authJwt.isModerador], async (req, res) => {
    const { username } = req.params;
    User.remove({ username: username })
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
})

module.exports = router;