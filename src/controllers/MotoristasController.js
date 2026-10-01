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

    buscarPorId = (req, res) => {
        const resultado = this.service.buscarPorId(req.params.id);
        return res.status(resultado.status).json(resultado.dados);
    };

    listarEntregas = (req, res) => {
        const resultado = this.service.listarEntregas(req.params.id, req.query.status);
        return res.status(resultado.status).json(resultado.dados);
    };

    atribuirMotorista = (req, res) => {
        const resultado = this.service.atribuirMotorista(req.params.id,req.body.motoristaId);
        return res.status(resultado.status).json(resultado.dados);
    };
}