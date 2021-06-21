import { Router } from 'express';

import AmbienteController from './AmbienteController';

const routes = Router();

[ AmbienteController ].forEach((route) => {
    routes.stack = [...routes.stack, ...route.stack];
});

export default routes;
