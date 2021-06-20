import Classes from '../System/Classes';

export interface IFeature {
    id: string;
    titulo: string;
    nome: string;
    descricao: string;
}

class Feature extends Classes {
    public static table = 'feature';
    public static fields = [
        { name: 'id', type: 'string', required: false },
        { name: 'titulo', type: 'string', required: true },
        { name: 'nome', type: 'string', required: true },
        { name: 'descricao', type: 'string', required: false }
    ];
}

export default Feature;
