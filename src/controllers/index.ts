import { Router } from 'express';

import AmbienteController from './AmbienteController';
import FeatureController from './FeatureController';
import FeatureAmbienteController from './FeatureAmbienteController';

const routes = Router();

[ 
    AmbienteController, 
    FeatureController, 
    FeatureAmbienteController 
].forEach((route) => {
    routes.stack = [...routes.stack, ...route.stack];
});

export default routes;
