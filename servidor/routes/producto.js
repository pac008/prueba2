const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//Obtener todos los productos
app.get('/productos', ( req, res) => {
    //populate usuario y categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
            .populate('usuario', 'nombre email')
            .populate('categoria', 'description')
            .skip(desde)
            .limit(limite)
            .exec( ( err, productosDB ) => {
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if( !productosDB ){
                    return res.status(400).json({
                        ok : false,
                        err: {
                            message: 'No hay productos registrados'
                        }
                    });
                }
                Producto.count( {disponible:true}, ( err, conteo ) => {

                    res.json({
                        ok: true,
                        TotalProductos: conteo,
                        producto: productosDB
                    })
                });
            });
});

//Obtener un producto
app.get('/productos/:id', ( req, res) => {
    //populate usuario y categoria
    let idProducto = req.params.id;
    
    Producto.findById(idProducto, { disponible: true })
                .populate('categoria','description')
                .populate('usuario','nombre email')
                .exec( ( err, productoDB ) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if( !productoDB ){
                return res.status(400).json({
                    ok : false,
                    err: {
                        message: 'ID incorrecto.'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            });
    });

});

app.get('/productos/buscar/:termino',verificaToken, ( req, res ) => {

    let termino = req.params.termino;
    
    let regex = new RegExp( termino, 'i');

    Producto.find({ nombre: regex, disponible: true, })
            .populate('categoria', 'description')
            .exec( ( err, productoDB ) => {
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    producto: productoDB
                })
            });
})

//Crear un productos
app.post('/productos', verificaToken, ( req, res ) => {
    
    let body = req.body;

    let producto = new Producto({
        nombre     : body.nombre,
        descripcion: body.descripcion,
        precioUni  : body.precioUni,
        categoria  : body.categoria,
        usuario    : req.usuario._id
    })

    producto.save( ( err, productoDB ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            pruducto: productoDB
        })
    })

});
//actualizar un productos
app.put('/productos/:id', ( req, res ) => {

    let idProducto = req.params.id;

    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible'] );

    Producto.findByIdAndUpdate( idProducto, body, { new: true, runValidators: true }, ( err, producto ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !producto){
            return res.status(400).json({
                ok : false,
                err: {
                    message: 'Producto no encontrado. Verifique el ID, por favor.'
                }
            });
        }
        res.json({
            ok: true,
            producto
        })
    });
});
//Borrar un productos
app.delete('/productos/:id', ( req, res) => {
    
    let idProducto = req.params.id;

    Producto.findByIdAndUpdate(idProducto, { disponible : false }, ( err, productoBorrado ) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productoBorrado ){
            return res.status(400).json({
                ok : false,
                err: {
                    message: 'ID incorrecto.'
                }
            });
       }
       res.json({
           ok: true,
           productoBorrado
       })
    });

});



module.exports = app;