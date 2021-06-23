import { Usuario } from "club7-lib-autorizador";

import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.AUTH_URL
});


class _Usuario {

    static async GetById(id, sid){
        try{
            const request = await axios.get(`/usuario/${id}`, { headers: { Authorization: sid, 'application': process.env.AUTH_APLICACAO }});
            return request.data.data;
        }catch(ex){
            return ex.response.data;
        }
    }

    static async Create(sid, data){
        return (await Usuario.Criar(sid, process.env.AUTH_APLICACAO, { ...data, perfil: process.env.AUTH_APLICACAO_PERFIL})).data;
    }
    
    static async Login(email, senha){
        return (await Usuario.Login(email, senha, process.env.AUTH_APLICACAO)).data;
    }
    
    static async Logout(sid){
        return (await Usuario.Logout(sid, process.env.AUTH_APLICACAO)).data;
    }

}

export default _Usuario;
