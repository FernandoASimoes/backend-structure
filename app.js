const express = require('express');
const app = express();
const db = require('./config/db');
const consign = require('consign');

// Carregamento automático dos módulos com Consign
consign()
  .include('./middlewares/passport.js')
  .then('./middlewares/passportClient.js')
  .then('./middlewares/passportClientBasic.js')
  .then('./middlewares/upload.js')
  .then('./middlewares/express.js')
  .then('./constants')
  .then('./utils')
  .then('./models')
  .then('./controllers')
  .then('./services')
  .into(app);

// Banco de dados
app.db = db;

// Exporta a aplicação para uso no server.js
module.exports = app;
