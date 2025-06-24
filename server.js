const app = require('./app');

const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
