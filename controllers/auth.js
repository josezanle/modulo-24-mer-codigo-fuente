const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT} = require('../helpers/jwt')




const crearUsuario = async (req, res = response) => {

    const {  email, password} = req.body;
    try {

        let usuario = await Usuario.findOne ({email});

        if (usuario) {
            return res.status(400).json({
                ok:false,
                msg: ' ya existe un usuario creado con ese correo'
            })
        }

         usuario = new Usuario(req.body);

        // Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt)


        await usuario.save();

        // genrarJWT
        const token = await generarJWT( usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: "registrado"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor contactese con su Administrador'
        })
    }

    
}

const loginUsuario = async (req, res = response) => {

    const { email, password} = req.body;

    try {
         const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usurio con ese email'
            })
        }

        // confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password)

        if( !validPassword) {
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            });
        }
        // genrarJWT
        const token = await generarJWT(usuario.id, usuario.name);

        // generar jwt
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con su equipo tenico'
        })
    }

    // // manejo de Errores
    // const errors = validationResult(req);
    
    // const { email, password } = req.body;

}

const revalidarToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    // generar un nuevo JWT y rtornarlo en esta peticion
    const token = await generarJWT(uid,name)



    res.json({
        ok: true,
        token,
        msg: "renew"
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken

}