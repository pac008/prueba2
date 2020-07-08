const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//Mostrar todas las categorias

app.get('/categoria', verificaToken, ( req, res ) => {
    
    Categoria.find()
            .sort('description')
            .populate('usuario','nombre email')
            .exec( (err, categorias) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                Categoria.count( (err, conteo) => {

                    res.json({
                        ok: true,
                        cuantos: conteo,
                        categorias
                    })
                })
            })
    
});

//Mostrar una categoria por ID

app.get('/categoria/:id', verificaToken, ( req, res ) => {
    //Categoria findById(..)
    let id = req.params.id;

    Categoria.findById(id, ( err, categoria ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

//Crear nueva categoria

app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoría
    // req.usuario._id
    let body = req.body;
    
    let categoria = new Categoria({
        description: body.description,
        usuario: req.usuario._id
    });

    categoria.save( (err, category) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !category ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok : true,
            category
        })    
    });
 
    console.log('Bonjour');
});

//Actualizar Categoría
app.put('/categoria/:id', verificaToken, (req, res) => {

    let usuario = req.params.id;

    let body = _.pick(req.body, ['description']);
        console.log(body);
    Categoria.findByIdAndUpdate(usuario, body, { new: true }, ( err, resp ) => {
        
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            categoriaActualizada: resp
        })
        
    })
        
});

//Borrar categoria

app.delete('/categoria/:id',[ verificaToken, verificaAdmin_Role ], ( req, res ) => {
    //Se necesita ser admin
    //categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, ( err, categoria ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada con éxito',
            categoria
        })
    });

});

module.exports = app;

