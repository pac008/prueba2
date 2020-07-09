const express    = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

let Usuario = require('../models/usuario');

let Producto = require('../models/producto');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', ( req, res ) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


        if( !req.files ){
            return res.status(400)
                        .json({
                            ok : false,
                            err: {
                                message: 'No hay ningún archivo'
                            }
                        });
        }

    let tiposValidos = ['usuarios', 'productos'];
    if( tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok : false,
            err: {
                message: ' los tipos permitidas son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    console.log(extension);
        
    //Extensiones permitidas

    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf( extension ) < 0 ){
        return res.status(400).json({
            ok : false,
            err: {
                message: ' las extensiones permitidas son: ' + extensionesValidas.join(', '),
                extension
            }
        });
    }

    let nombreImagen = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreImagen}`, ( err ) => {
        if( err ){
            return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
        }
        if( tipo === 'usuarios'){
            usuarioImagen(id, res, nombreImagen );

        }
        else{
            productoImagen(id, res, nombreImagen);

        }
    });
});

usuarioImagen = (id, res, nombreImagen) => {
    
    Usuario.findById(id, ( err, usuarioDB) => {
        if( err ){

            borraArchivo(nombreImagen, 'usuarios');

            return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
        }
        if( !usuarioDB ){

            borraArchivo(nombreImagen, 'usuarios');

            return res.status(400)
                        .json({
                            ok : false,
                            err: {
                                message: 'ID incorrecto'
                            }
                        });
        }

       /*  let pathImagen =  path.resolve( __dirname, `../../uploads/usuarios/${ usuarioDB.img }` ); 
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen );
        } */
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreImagen;

        usuarioDB.save( (err, UsuarioActualizado ) => {
            res.json({
                ok:true,
                UsuarioActualizado
            });
        });
    });



}

productoImagen = ( id, res, nombreImagen ) => {

    Producto.findById(id, ( err, productoDB ) => {
        if( err ){

            borraArchivo(nombreImagen, 'productos');

            return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
        }
        if( !productoDB ){

            borraArchivo(nombreImagen, 'productos');

            return res.status(400)
                        .json({
                            ok : false,
                            err: {
                                message: 'ID incorrecto'
                            }
                        });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreImagen;

        productoDB.save( (err, productoActualizado ) => {
            res.json({
                ok:true,
                productoActualizado
            });
        });
    })
}


borraArchivo = ( nombreArchivo, tipo) => {

    let pathImagen =  path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreArchivo }` ); 
    if( fs.existsSync( pathImagen ) ){
        fs.unlinkSync( pathImagen );
    }
}

module.exports = app;