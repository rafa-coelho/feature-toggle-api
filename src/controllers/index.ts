import { Router } from 'express';

import AmbienteController from './AmbienteController';
import FeatureController from './FeatureController';
import FeatureAmbienteController from './FeatureAmbienteController';
import AuthController from './AuthController';

const routes = Router();

[ 
    AmbienteController, 
    FeatureController, 
    FeatureAmbienteController,
    AuthController,
    
].forEach((route) => {
    routes.stack = [...routes.stack, ...route.stack];
});

export default routes;
