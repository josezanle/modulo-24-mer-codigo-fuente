// Event Routes
// /api/events


const { Router}= require('express')
const {validarJWT} = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {isDate} = require('../helpers/isDate');


const router = Router();

// al utilizar este middleware en este lugar, estamos enviendo a todas las rutas esta instruccion
router.use( validarJWT);


// obtener eventos
router.get('/',getEventos)


// crear un nuevo evento
router.post('/',[


    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate),
    // check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
]
,
 crearEvento)

// actualizar un nuevo evento
router.put('/:id', actualizarEvento)

// eliminar un nuevo evento
router.delete('/:id', eliminarEvento)


module.exports = router;