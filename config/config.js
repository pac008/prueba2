//=========================
//PUERTO
//========================



process.env.PORT = process.env.PORT || 3000;


//=========================
//entorno
//========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 


//=========================
//Caducidad de token
//========================
//60 * 60 * 24 * 30

process.env.CADUCIDAD = 60 * 60 * 24 * 30;


//=========================
//SEED
//========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; 

//=========================
//desarrollo
//========================

let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;



//=========================
//CLIENT_ID
//========================


process.env.CLIENT_ID = process.env.CLIENT_ID || '328240410403-5npng252epn0tnnq1i44qafeb3nrjrl8.apps.googleusercontent.com';