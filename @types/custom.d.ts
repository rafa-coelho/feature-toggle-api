declare namespace Express {
    export interface Request {
       usuario?: { [k:string]: any }
       aplicacao?: { [k:string]: any }
       sessao?: { [k:string]: any }
    }
 }
