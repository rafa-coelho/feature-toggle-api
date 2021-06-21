import { Router } from 'express';
import Util from '../System/Util';
import Ambiente, { IAmbiente } from '../classes/Ambiente';
import Feature, { IFeature } from '../classes/Feature';
import FeatureAmbiente, { IFeatureAmbiente } from '../classes/FeatureAmbiente';

const routes = Router();

routes.post(`/feature/ambiente`, async (req, res) => {
    const { body } = req;

    const resp = {
        status: 0,
        data: null,
        errors: [],
        msg: ''
    };

    resp.errors = await FeatureAmbiente.Validate(body);

    if (resp.errors.length > 0)
        return res.status(400).send(resp);


    const ambiente = <IAmbiente> await Ambiente.GetFirst(`id = '${body.ambiente}'`);
    if(ambiente === null){
        resp.errors.push({
            msg: "Ambiente não encontrado!"
        });
        return res.status(404).send(resp);
    }

    const feature = <IFeature> await Feature.GetFirst(`id = '${body.feature}'`);
    if(feature === null){
        resp.errors.push({
            msg: "Feature não encontrada!"
        });
        return res.status(404).send(resp);
    }
    
    const featureAmbienteExiste = <IFeatureAmbiente> await FeatureAmbiente.GetFirst(`feature = '${body.feature}' AND ambiente = '${body.ambiente}'`);
    if(featureAmbienteExiste !== null){
        resp.errors.push({
            msg: "Este ambiente já está vinculado à essa feature!"
        });
        return res.status(400).send(resp);
    }

    const payload : IFeatureAmbiente = {
        id: Util.GUID(),
        ambiente: body.ambiente,
        feature: body.feature,
        alvo: body.alvo,
        status: body.status || 0
    };

    const create = await FeatureAmbiente.Create(payload);
    if(create.status !== 1){
        resp.errors.push({
            msg: "Erro ao inserir o Ambiente"
        });
        return res.status(500).send(create);
    }

    resp.status = 1;
    resp.msg = 'Ambiente inserido com sucesso!';
    resp.data = payload;
    res.send(resp);
});

routes.get(`/feature/:feature/ambiente`, async (req, res) => {
    const { params } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const feature = <IFeature> await Feature.GetFirst(`id = '${params.feature}'`);
    if(feature === null){
        resp.errors.push({
            msg: "Feature não encontrada"
        });
        return res.status(404).send(resp);
    }

    
    const ambientes = <IFeatureAmbiente[]> await FeatureAmbiente.Get(`feature = '${feature.id}'`);
    for (const i in ambientes) {
        ambientes[i].ambiente_codigo = (<IAmbiente> await Ambiente.GetFirst(`id = '${ambientes[i].ambiente}'`)).codigo;
    }
    
    resp.status = 1;
    resp.data = ambientes;
    res.send(resp);
});

routes.get(`/feature-ambiente/:id`, async (req, res) => {
    const { params } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const featureAmbiente = <IFeatureAmbiente> await FeatureAmbiente.GetFirst(`id = '${params.id}'`);
    if(featureAmbiente === null){
        resp.errors.push({
            msg: "Ambiente não encontrado"
        });
        return res.status(404).send(resp);
    }
    
    featureAmbiente.ambiente_codigo = (<IAmbiente> await Ambiente.GetFirst(`id = '${featureAmbiente.ambiente}'`)).codigo;
    
    resp.status = 1;
    resp.data = featureAmbiente;
    res.send(resp);
});

routes.put('/feature-ambiente/:id', async (req, res) => {
    const { params, body } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const featureAmbiente = <IFeatureAmbiente> await FeatureAmbiente.GetFirst(`id = '${params.id}'`);
    
    if (featureAmbiente === null) {
        resp.errors.push({
            msg: 'Feature não encontrada!'
        });
        return res.status(404).send(resp);
    }

    const data : { [k: string] : any} = {};
    
    const proibidos = [ 'id', 'ambiente', 'feature' ];
    let edit = false;
    
    FeatureAmbiente.fields.forEach(campo => {
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

    const update = await FeatureAmbiente.Update(data, `id = '${params.id}'`);

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

export default routes;
