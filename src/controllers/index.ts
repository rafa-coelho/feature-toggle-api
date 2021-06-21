import { Router } from 'express';

import AmbienteController from './AmbienteController';
import FeatureController from './FeatureController';

const routes = Router();

[ AmbienteController, FeatureController ].forEach((route) => {
    routes.stack = [...routes.stack, ...route.stack];
});

export default routes;
