const pool = require('../conexao.js');

const listarTransacoes = async (req, res) => {
    let filtro = req.query.filtro;
    const usuarioId = req.usuario.id

    try {
        if (filtro) {
            filtro = Array.isArray(filtro) ? filtro : [req.query.filtro];
            const query = `select transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, transacoes.categoria_id, categorias.descricao as categoria_nome from transacoes join categorias on transacoes.categoria_id = categorias.id
            where categorias.descricao ilike any($1) and transacoes.usuario_id = $2`
            const values = [filtro, usuarioId];
            const transacaoExiste = await pool.query(query, values);

            return res.json(transacaoExiste.rows)
        }

        const transacaoExiste = await pool.query("select transacoes.id, transacoes.tipo, transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, transacoes.categoria_id, categorias.descricao as categoria_nome from transacoes join categorias on transacoes.categoria_id = categorias.id where transacoes.usuario_id =  $1", [usuarioId]);

        return res.json(transacaoExiste.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const detalharTransacao = async (req, res) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;

    if (!id) {
        return res.status(400).json({ mensagem: 'O parametro id é obrigatório.' });
    }

    try {
        const query = "select * from transacoes where id = $1 and usuario_id = $2";
        const values = [id, usuarioId];
        const transacao = await pool.query(query, values);

        if (transacao.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }

        const categoriaExiste = await pool.query("select * from categorias where id = $1", [transacao.rows[0].categoria_id]);

        if (categoriaExiste.rows.length === 0) {
            return res.status(404).json({ mensagem: "Categoria informada não existe." })
        }

        const categoria_nome = categoriaExiste.rows[0].descricao

        console.log(transacao.rows[0].tipo)

        return res.json({
            id: transacao.rows[0].id,
            tipo: transacao.rows[0].tipo,
            descricao: transacao.rows[0].descricao,
            valor: transacao.rows[0].valor,
            data: transacao.rows[0].data,
            categoria_id: transacao.rows[0].categoria_id,
            usuario_id: transacao.rows[0].usuario_id,
            categoria_nome
        });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const cadastrarTransacoes = async (req, res) => {
    const usuarioId = req.usuario.id;

    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
    }

    try {

        if (tipo != "entrada" && tipo != "saida") {
            return res.status(400).json({ mensagem: "O tipo deve ser 'entrada' ou 'saida'" });
        }

        const categoriaExiste = await pool.query("select * from categorias where id = $1", [categoria_id]);

        if (categoriaExiste.rows.length === 0) {
            return res.status(404).json({ mensagem: "Categoria informada não existe." })
        }

        const categoria_nome = categoriaExiste.rows[0].descricao

        const query = `insert into transacoes (usuario_id, descricao, valor, data, categoria_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *`;

        const { rows } = await pool.query(query, [usuarioId, descricao, valor, data, categoria_id, tipo])

        const id = rows[0].id;

        return res.status(201).json({
            id,
            tipo,
            descricao,
            valor,
            data,
            categoria_id,
            usuario_id: usuarioId,
            categoria_nome

        });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
    }

    try {
        const categoriaExiste = await pool.query("select * from categorias where id = $1", [categoria_id]);

        if (categoriaExiste.rows.length === 0) {
            return res.status(404).json({ mensagem: "Categoria informada não existe." })
        }

        const transacao = await pool.query("select * from transacoes where id = $1 and usuario_id = $2", [id, usuarioId]);

        if (transacao.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Transação informada não existe ou não pertence ao usuário logado.' })
        }

        if (tipo != "entrada" && tipo != "saida") {
            return res.status(400).json({ mensagem: "O tipo deve ser 'entrada' ou 'saida." });
        }

        const query = `update transacoes set 
                        descricao = $1, 
                        valor = $2, 
                        data = $3, 
                        categoria_id = $4, 
                        tipo = $5 
                        where id = $6 and usuario_id = $7`;

        const values = [descricao, valor, data, categoria_id, tipo, id, usuarioId];
        await pool.query(query, values);

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const excluirTransacao = async (req, res) => {
    const usuarioId = req.usuario.id;
    const { id } = req.params

    try {
        const transacao = await pool.query("select * from transacoes where id = $1 and usuario_id = $2", [id, usuarioId]);

        if (transacao.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Transação informada não existe ou não pertence ao usuário logado.' })
        }

        await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id, usuarioId]);

        return res.status(204).json();;

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}

const obterExtrato = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const entrada = await pool.query("select sum(valor)from transacoes where usuario_id = $1 and tipo = 'entrada';", [usuarioId]);
        const saida = await pool.query("select sum(valor)from transacoes where usuario_id = $1 and tipo = 'saida';", [usuarioId]);

        const extrato = {
            entrada: entrada.rows[0].sum ? entrada.rows[0].sum : 0,
            saida: saida.rows[0].sum ? saida.rows[0].sum : 0
        }

        return res.json(extrato);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor. ${error.message}` });
    }
}


module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacoes,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}