export class MotoristasController {
    constructor(service) {
        this.service = service;
    }

    listar = (req, res) => {
        const resultado = this.service.listar();
        return res.status(resultado.status).json(resultado.dados);
    }

    criar = (req, res) => {
        const resultado = this.service.criar(req.body);

        return res.status(resultado.status).json(resultado.dados);
    };
}