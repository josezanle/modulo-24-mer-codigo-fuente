const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req,res = response) => {


    const eventos = await Evento.find()
                                .populate('user');


    res.json({
        ok: true,
        eventos
    })
}


const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {
    evento.user = req.uid;    

    // guardar en la db
    const eventoGuardado = await evento.save()

     res.json({
         ok:true,
         evento: eventoGuardado
     })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador'
        })
        
    }
}

const actualizarEvento =async (req,res = response)=>{


    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId);
        const uid = req.uid;

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:"Evento no existe por ese ID"
            })
        }

        if ( evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tinen privilegios para editar este evento'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento)
        res.json({
            ok:true,
            evento: eventoActualizado
        })
       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el Administrador"
        })
        
    }
}

const eliminarEvento = async (req,res = response)=> {

    
    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if (!evento) {
           return  res.status(404).json({
                ok: false,
                msg: "Evento no existe por ese ID"
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tinen privilegios para editar este evento'
            })
        }
        

        await Evento.findByIdAndDelete(eventoId)
        res.json({
            ok: true,
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador"
        })

    }

  
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}