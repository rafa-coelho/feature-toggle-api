import Classes from '../System/Classes';

export interface IFeatureAmbiente {
    id: string;
    feature: string;
    ambiente: string;
    alvo: string;
    status: number;
    ambiente_codigo?: string;
}

class FeatureAmbiente extends Classes {
    public static table = 'feature_ambiente';
    public static fields = [
        { name: 'id', type: 'string', required: false },
        { name: 'feature', type: 'string', required: true },
        { name: 'ambiente', type: 'string', required: true },
        { name: 'alvo', type: 'number', required: false },
        { name: 'status', type: 'string', required: false }
    ];
}

export default FeatureAmbiente;
