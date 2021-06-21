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

routes.get(`/feature`, async (req, res) => {
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

    const features = <IFeature[]> await Feature.Get(where, order_by, limit);

    for (const i in features)
        features[i].ambientes = (<IStatusFeature[]> await StatusFeature.Get(`feature = '${features[i].id}'`));
        
    res.set('X-TOTAL-COUNT', await Feature.Count(where));

    resp.status = 1;
    resp.data = features;
    res.send(resp);
});

routes.get('/feature/:id', async (req, res) => {
    const { params } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const feature = <IFeature> await Feature.GetFirst(`id = '${params.id}'`);
    feature.ambientes = <IStatusFeature[]> await StatusFeature.Get(`feature = '${feature.id}'`);
    
    if (feature === null) {
        resp.errors.push({
            msg: 'Feature não encontrada!'
        });
        return res.status(404).send(resp);
    }

    resp.status = 1;
    resp.data = feature;
    res.send(resp);
});

export default routes;
