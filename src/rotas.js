const express = require('express');
const { cadastrarUsuario, loginUsuario, detalharUsuarios, atualizarUsuario, listarCategorias } = require('./controladores/usuario.js');
const { listarTransacoes, detalharTransacao, cadastrarTransacoes, atualizarTransacao, excluirTransacao, obterExtrato } = require('./controladores/transacoes.js');
const verificaLogin = require('./intermediarios/verificaLogin.js');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', loginUsuario);

rotas.use(verificaLogin);

rotas.get('/usuario', detalharUsuarios);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacoes);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas;