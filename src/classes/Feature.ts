import Classes from '../System/Classes';
import Ambiente, { IAmbiente } from './Ambiente';

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


    static async Validate (data: { [k: string]: any }): Promise<{ msg: string; }[]> {
        const errors = [];

        for (const field of this.fields) {

            if ((typeof data[field.name] === 'undefined' || [null, ''].includes(<string>data[field.name])) && field.required) {
                errors.push({
                    msg: `Campo '${field.name}' é obrigatório!`
                });
            }

            if (!(typeof data[field.name] === 'undefined' || [null, ''].includes(<string>data[field.name])) && typeof data[field.name] !== field.type) {
                errors.push({
                    msg: `Campo '${field.name}' precisa ser do tipo '${field.type}'!`
                });
            }
        }
        
        if(typeof data['ambientes'] === 'undefined'){
            errors.push({
                msg: `O campo "ambientes" é obrigatório!`
            });
        }else{
            if(!Array.isArray(data['ambientes'])){
                errors.push({
                    msg: `O campo "endereço" precisa ser um Array!`
                });
            }else{
                if(data['ambientes'].length === 0){
                    errors.push({
                        msg: `O array "ambientes" não pode estar vazio!`
                    });
                }else{
                    for (const ambiente of data['ambientes']) {
                        if(typeof ambiente['codigo'] === 'undefined'){
                            errors.push({
                                msg: `O Campo "ambiente.codigo" é obrigatório!`
                            });
                        }else{
                            const ambienteExiste = <IAmbiente> await Ambiente.GetFirst(`codigo = '${ambiente.codigo}'`);
                            if(ambienteExiste === null){
                                errors.push({
                                    msg: `O ambiente "${ambiente.codigo}" não existe!`
                                });
                            }
                        }
                        
                        if(typeof ambiente['status'] === 'undefined'){
                            errors.push({
                                msg: `O Campo "ambiente.status" é obrigatório!`
                            });
                        }
                    }

                }
            }
        }

        return errors;
    }
}

export default Feature;
