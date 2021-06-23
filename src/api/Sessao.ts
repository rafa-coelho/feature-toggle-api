import Usuario from './Usuario';
import AUTH from "club7-lib-autorizador";

class Sessao {

    static async ValidarPermissao(req, res, next) {
        const { headers, path, method } = req;
        
        const aberto = (await AUTH.Permissao.VerificarAberto(process.env.AUTH_APLICACAO, path, method)).data;

        if(aberto.data){
            return next();
        }        
        
        const sid = headers['authorization'] || "";
        let sessao = (await AUTH.Sessao.Get(sid, process.env.AUTH_APLICACAO)).data;

        if (sessao.status !== 1) {
            return res.status(403).send(sessao);
        }

        const permissao = (await AUTH.Permissao.Verificar(sid, process.env.AUTH_APLICACAO, path, method)).data;

        if(!permissao.data){
            return res.status(403).send({
                status: 0,
                errors: [
                    { msg: "Você não tem permissão para acessar este método!" }
                ]
            });
        }

        sessao = sessao.data.data;
        const usuario = await Usuario.GetById(sessao.usuario, sessao.id);
        req.sessao = sessao;
        req.usuario = usuario;
        next();
    }

}

export default Sessao;
