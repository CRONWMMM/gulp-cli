/**
 * Created by kimmm on 2018/3/21.
 */
const port = 3000;
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

server.listen(port);
