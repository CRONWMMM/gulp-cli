/**
 * Created by CRONWMMM on 2018/3/21.
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

app.get('/index', (req, res) => {
    res.render('index.html');
});

app.get('/login', (req, res) => {
    res.render('login.html');
});

server.listen(port);




