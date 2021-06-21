import { Router } from 'express';
import Util from '../System/Util';
import Ambiente, { IAmbiente } from '../classes/Ambiente';


const routes = Router();


routes.post(`/ambiente`, async (req, res) => {
    const { body } = req;

    const resp = {
        status: 0,
        data: null,
        errors: [],
        msg: ''
    };

    resp.errors = await Ambiente.Validate(body);

    if (resp.errors.length > 0)
        return res.status(400).send(resp);

    const ambienteExiste = <IAmbiente> await Ambiente.GetFirst(`nome = '${body.nome}' OR codigo = '${body.codigo}'`);
    if(ambienteExiste !== null){
        resp.errors.push({
            msg: `Já existe um ambiente com esse ${ambienteExiste.nome === body.nome ? "nome" : "código" }!`
        });
        return res.status(400).send(resp);
    }

    const payload : IAmbiente = {
        id: Util.GUID(),
        nome: body.nome,
        codigo: body.codigo,
        descricao: body.descricao
    };
    
    const create = await Ambiente.Create(payload);
    if(create.status !== 1){
        resp.errors.push({
            msg: "Erro ao criar ambiente"
        });
        return res.status(500).send(resp);
    }

    resp.status = 1;
    resp.msg = 'Ambiente criado com sucesso!';
    resp.data = payload;
    res.send(resp);
});

routes.get(`/ambiente`, async (req, res) => {
    const { query } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const where = (query.where) ? Util.utf8Decode(unescape(String(query.where))) : '';
    const order_by = String((query.order_by) ? query.order_by : '');
    const limit = String((query.limit) ? query.limit : '');

    const ambientes = <IAmbiente[]> await Ambiente.Get(where, order_by, limit);

    res.set('X-TOTAL-COUNT', await Ambiente.Count(where));

    resp.status = 1;
    resp.data = ambientes;
    res.send(resp);
});

routes.get('/ambiente/:id', async (req, res) => {
    const { params } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const ambiente = <IAmbiente> await Ambiente.GetFirst(`id = '${params.id}' OR codigo = '${params.id}'`);
    
    if (ambiente === null) {
        resp.errors.push({
            msg: 'Ambiente não encontrado!'
        });
        return res.status(404).send(resp);
    }

    resp.status = 1;
    resp.data = ambiente;
    res.send(resp);
});

routes.put('/ambiente/:id', async (req, res) => {
    const { params, body } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const ambienteGet = <IAmbiente> await Ambiente.GetFirst(`id = '${params.id}'`);
    
    if (ambienteGet === null) {
        resp.errors.push({
            msg: 'Ambiente não encontrado!'
        });
        return res.status(404).send(resp);
    }

    const data : { [k: string] : any} = {};
    
    const proibidos = [ 'id' ];
    let edit = false;
    
    Ambiente.fields.forEach(campo => {
        if (body[campo.name] !== undefined && !proibidos.includes(campo.name)) {
            data[campo.name] = body[campo.name];
            edit = true;
        }
    });

    if (!edit) {
        resp.errors.push({
            msg: 'Nada para editar'
        });
        return res.status(400).send(resp);
    }

    const update = await Ambiente.Update(data, `id = '${params.id}'`);

    if (update.status !== 1) {
        resp.errors.push({
            msg: 'Não foi possivel atualizar'
        });

        return res.status(500).send(resp);
    }

    resp.status = 1;
    resp.msg = 'Atualizado com sucesso';
    res.send(resp);
});

routes.delete('/ambiente/:id', async (req, res) => {
    const { params } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const ambienteGet = <IAmbiente> await Ambiente.GetFirst(`id = '${params.id}'`);

    if (ambienteGet === null) {
        resp.errors.push({
            msg: 'Ambiente não encontrado!'
        });
        return res.status(404).send(resp);
    }

    const del = await Ambiente.Delete(`id = '${params.id}'`);

    if (del.status !== 1) {
        resp.errors.push({
            msg: 'Não foi possivel excluir'
        });

        return res.status(500).send(resp);
    }

    resp.status = 1;
    resp.msg = 'Excluido com sucesso';
    res.send(resp);
});


export default routes;
