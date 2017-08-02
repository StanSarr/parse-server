/**
 * Created by StanSARR on 01/02/2017.
 *
 */
'use strict';

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const ParseDashboard = require("parse-dashboard");

// Configuration de notre server

const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.APP_ID || 'first-parse-server-2017-07';
//Ceci doit rester secret
const MASTER_KEY = process.env.MASTER_KEY || 'F23xUQdRmQLQwxV5N6a74kqF8aPqIM9F';
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/first-parse-server-2017-07';
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH || 'parse:server';

const app = express();

const parseServerAPI = new ParseServer({
    databaseURI: DATABASE_URI,
    cloud: path.resolve(__dirname, 'cloud.js'),
    appId: APP_ID,
    masterKey: MASTER_KEY,
    serverURL: `http://${SERVER_HOST}:${SERVER_PORT}/parse`
});

if(IS_DEVELOPMENT) {
    let users;
    if (DASHBOARD_AUTH) {
        const [user, pass] = DASHBOARD_AUTH.split(':');
        users = [{user, pass}];
    }
    const dashboard = ParseDashboard({
        apps: [{
            serverURL: '/parse',
            appId: APP_ID,
            masterKey: MASTER_KEY,
            appName: 'PREMIER-PARSE-SERVER',
        }],
        users,
    }, IS_DEVELOPMENT);
    app.use("/dashboard", dashboard);
}

app.get("/", (req, res) => {
    res.end("IS_DEVELOPMENT => " + IS_DEVELOPMENT);
});

app.use('/parse', parseServerAPI);

app.listen(SERVER_PORT, () => console.log(
    `Notre serveur tourne en mode ${process.env.NODE_ENV || 'development'} sur http://localhost:${SERVER_PORT}`
));