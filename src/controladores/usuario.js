
const key = require('../key')
const pool = require('../conexao.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios' });
    }

    try {
        const emailExiste = await pool.query("select * from usuarios where email = $1", [email]);

        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const query = "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *";
        const values = [nome, email, senhaCriptografada];
        const { rows } = await pool.query(query, values);

        const novoUsuario = {
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
        };
        return res.status(201).json(novoUsuario);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }



}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Os campos email e senha são obrigatórios' });
    }

    try {
        const usuario = await pool.query("select * from usuarios where email = $1", [email]);

        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValida) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, key, { expiresIn: '10h' });

        const { senha: _, ...usuarioLogado } = usuario.rows[0];

        return res.json({ usuario: usuarioLogado, token });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const detalharUsuarios = async (req, res) => {
    try {
        return res.json(req.usuario);
    } catch (error) {
        res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    const usuarioId = req.usuario.id

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios' });
    }

    try {

        const emailExiste = await pool.query("select * from usuarios where email = $1", [email]);

        if (emailExiste.rowCount > 0 && emailExiste.rows[0].id != usuarioId) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.query(
            'update usuarios set nome = $1, email = $2, senha = $3 where id = $4',
            [nome, email, senhaCriptografada, usuarioId]);

        return res.status(204).send();

    } catch (error) {
        res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }
}


const listarCategorias = async (req, res) => {
    try {
        const categorias = await pool.query("select * from categorias");
        return res.json(categorias.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}



module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuarios,
    atualizarUsuario,
    listarCategorias
}

