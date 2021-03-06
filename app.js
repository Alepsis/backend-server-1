// Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');





// Iniciarlizar variables

var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/montesoridb', function(err, res) {
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m ', 'online');


});

//  Importar Rutas 

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones 
app.listen(3000, function() {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m ', 'online');
});