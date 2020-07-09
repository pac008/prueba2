const express = require('express');
const fs = require('fs');
let app = express();
const { verificaTokenImg } = require('./../middlewares/autenticacion')

const path = require('path');





app.get('/imagen/:tipo/:img', verificaTokenImg, ( req, res ) =>{
    
    let tipo = req.params.tipo;
    let img  = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    if( fs.existsSync( pathImg ) ){
        res.sendFile(pathImg);
    }else{
        let pathNoImagen = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(pathNoImagen);
    }

});



module.exports = app;
