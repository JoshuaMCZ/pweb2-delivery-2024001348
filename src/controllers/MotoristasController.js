export class MotoristasController {
    constructor(service) {
        this.service = service;
    }

    listar = async (req, res) => {
        const resultado = await this.service.listar();
        return res.status(resultado.status).json(resultado.dados);
    }

    criar = async (req, res) => {
        const resultado = await this.service.criar(req.body);
        return res.status(resultado.status).json(resultado.dados);
    };

    buscarPorId = async (req, res) => {
        const resultado = await this.service.buscarPorId(req.params.id);
        return res.status(resultado.status).json(resultado.dados);
    };

    listarEntregas = async (req, res) => {
        const resultado = await this.service.listarEntregas(req.params.id, req.query.status);
        return res.status(resultado.status).json(resultado.dados);
    };

    atribuirMotorista = async (req, res) => {
        const resultado = await this.service.atribuirMotorista(req.params.id,req.body.motoristaId);
        return res.status(resultado.status).json(resultado.dados);
    };
}