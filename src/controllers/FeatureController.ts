import { Router } from 'express';
import Util from '../System/Util';
import Feature, { IFeature } from '../classes/Feature';
import StatusFeature, { IStatusFeature } from '../classes/StatusFeature';
import Ambiente from '../classes/Ambiente';


const routes = Router();


routes.post(`/feature`, async (req, res) => {
    const { body } = req;

    const resp = {
        status: 0,
        data: null,
        errors: [],
        msg: ''
    };

    resp.errors = await Feature.Validate(body);

    if (resp.errors.length > 0)
        return res.status(400).send(resp);

    const featureExiste = <IFeature> await Feature.GetFirst(`nome = '${body.nome}'`);
    if(featureExiste !== null){
        resp.errors.push({
            msg: "Já existe uma feature com esse nome!"
        });
        return res.status(400).send(resp);
    }

    const payload : IFeature = {
        id: Util.GUID(),
        titulo: body.titulo,
        nome: body.nome,
        descricao: body.descricao
    };

    const create = await Feature.Create(payload);
    if(create.status !== 1){
        resp.errors.push({
            msg: "Erro ao criar frature"
        });
        return res.status(500).send(create);
    }

    body.ambientes.forEach(async ambiente => {
        const ambientePayload : IStatusFeature = {
            id: Util.GUID(),
            feature: payload.id,
            alvo: ambiente.alvo,
            status: ambiente.status,
            ambiente: (await Ambiente.GetFirst(`codigo = '${ambiente.codigo}'`)).id
        };

        StatusFeature.Create(ambientePayload);
    });

    resp.status = 1;
    resp.msg = 'Feature criada com sucesso!';
    resp.data = payload;
    res.send(resp);
});


export default routes;
