import { Router } from 'express';
import Usuario from '../api/Usuario';

const routes = Router();

routes.post(`/usuario`, async (req, res) => {
    res.send(await Usuario.Create(req.sessao?.id || "", req.body));
});


export default routes;
