import { Router } from 'express';
import Usuario from '../api/Usuario';

const routes = Router();

routes.post(`/login`, async (req, res) => {
    const { body } = req;
    const resp = {
        status: 0,
        msg: '',
        data: null,
        errors: []
    };

    const obrigatorios = ["email", "senha"];

    obrigatorios.forEach(campo => {

        if (typeof body[campo] === "undefined" || [null, ''].includes(<string>body[campo])) {

            resp.errors.push({
                msg: `O campo '${body[campo]}' é obrigatório!`
            });
        }
    });

    if (resp.errors.length > 0) {
        return res.status(400).send(resp);
    }

    const login = await Usuario.Login(body.email, body.senha);
    if (login.status !== 1)
        return res.status(400).send(login);

    resp.status = 1;
    resp.msg = "Login efetuado com sucesso";
    resp.data = login.data;
    res.send(resp);
});


routes.post('/logout', async (req, res) => {
    const { headers } = req;
    const resp = {
        status: 0,
        msg: '',
        errors: []
    };

    const sid = headers['authorization'];
    const logout = await Usuario.Logout(sid);
    if (logout.status !== 1)
        return res.status(400).send(logout);

    resp.status = 1;
    resp.msg = "Logout efetuado com sucesso";
    res.send(resp);
});

export default routes;
