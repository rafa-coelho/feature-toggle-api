import Classes from '../System/Classes';

export interface IAmbiente {
    id: string;
    nome: string;
    codigo: string;
    descricao: string;
}

class Ambiente extends Classes {
    public static table = 'ambiente';
    public static fields = [
        { name: 'id', type: 'string', required: false },
        { name: 'nome', type: 'string', required: true },
        { name: 'codigo', type: 'string', required: true },
        { name: 'descricao', type: 'string', required: false }
    ];
}

export default Ambiente;
