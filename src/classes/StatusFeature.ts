import Classes from '../System/Classes';

export interface IStatusFeature {
    id: string;
    feature: string;
    ambiente: string;
    alvo: string;
    status: number;
}

class StatusFeature extends Classes {
    public static table = 'status_feature';
    public static fields = [
        { name: 'id', type: 'string', required: false },
        { name: 'feature', type: 'string', required: true },
        { name: 'ambiente', type: 'string', required: true },
        { name: 'alvo', type: 'number', required: false },
        { name: 'status', type: 'string', required: false }
    ];
}

export default StatusFeature;
