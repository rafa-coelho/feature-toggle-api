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


export default routes;
