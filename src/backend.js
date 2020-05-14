
const colors = require('colors');
require('dotenv').config()

const packageJSON = require('../package.json');
const { name:APP_NAME } = packageJSON;
const { BACKEND_PORT, DB } = process.env;

console.log('backend'.green,'starting');

/*
██████   █████  ████████  █████  ██████   █████  ███████ ███████
██   ██ ██   ██    ██    ██   ██ ██   ██ ██   ██ ██      ██
██   ██ ███████    ██    ███████ ██████  ███████ ███████ █████
██   ██ ██   ██    ██    ██   ██ ██   ██ ██   ██      ██ ██
██████  ██   ██    ██    ██   ██ ██████  ██   ██ ███████ ███████
*/

const mongoose = require('mongoose');
mongoose.connect( DB, { useNewUrlParser:true, useUnifiedTopology: true })
.then( e => console.log('backend'.green,'db','connected') );

/*
███████ ██   ██ ██████  ██████  ███████ ███████ ███████
██       ██ ██  ██   ██ ██   ██ ██      ██      ██
█████     ███   ██████  ██████  █████   ███████ ███████
██       ██ ██  ██      ██   ██ ██           ██      ██
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████
*/

const express = require('express');
const app = express();

// json body parser
app.use( express.json() );

const authPassport = require('./auth/passport');

authPassport(app);

app.listen(BACKEND_PORT, e => console.log('backend'.green,'listening'.bold));
