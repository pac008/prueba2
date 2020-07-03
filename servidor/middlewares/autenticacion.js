const jwt = require('jsonwebtoken');

//===========================
// Verificar token
//===========================

let verificaToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if( err ) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        req.usuario = decoded.usuario
        next();
    })
};

//===========================
// Verifica role admin
//===========================

let verificaAdmin_Role = ( req, res, next ) => {

    let usuario = req.usuario;

    if ( usuario.role !== 'ADMIN_ROLE') {
      return  res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es admin'
            }
        })
    }
    next(); 
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}