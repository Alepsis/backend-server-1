var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Usuario = require('../models/usuario');

//===================================
//Obtener todos los usuarios
//===================================
app.get('/', function(req, res, next) {

    Usuario.find({}, 'nombre email img role')
        .exec(
            function(err, usuarios) {

                if (err) {

                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error Cargando usuario',
                        errors: err,

                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});




//===================================
//Actualizar  usuario
//===================================

app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {

    var id = req.params.id;

    var body = req.body;

    Usuario.findById(id, function(err, usuario) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err

            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe ',
                errors: { message: 'No exuste un usuario con ese ID' }

            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save(function(err, usuarioGuardado) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario usuario',
                    errors: err

                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });



});


//===================================
//crear un nuevp usuario
//===================================

app.post('/', mdAutenticacion.verificaToken, function(req, res) {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role

    });

    usuario.save(function(err, usuarioGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err

            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });


});


//===================================
//Eliminar  usuario
//===================================

app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, function(err, usuarioBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err

            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }

            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado

        });

    });


});


module.exports = app;