/**
 * Created by kimmm on 2018/3/21.
 */
const port = 8000;
const http = require('http');
const path = require('path');
const express = require('express');
const debug = require('debug')('mydemo:server');
const app = express();
/**
 * Get port from environment and store in Express.
 */
app.set('port', port);

const server = http.createServer(app);

let dirname = 'build';

// view engine setup
app.set('views', path.join(__dirname, dirname+'/views/'));
app.set('view engine', 'html');
app.engine('.html',require('ejs').__express);//两个下划线
// app.use(express.static(path.join(__dirname, dirname+'/static')));
app.use(express.static(path.join(__dirname, dirname)));

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/index', (req, res) => {
    res.render('index.html');
});

app.get('/login', (req, res) => {
    res.render('login.html');
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
