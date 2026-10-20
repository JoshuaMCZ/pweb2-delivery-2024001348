export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res) => {
    const resultado = await this.service.criar(req.body ?? {});
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  listar = async (req, res) => {
    const resultado = await this.service.listar(req.query.status);
    return res.status(resultado.status).json(resultado.dados);
  };

  buscarPorId = async (req, res) => {
    const resultado = await this.service.buscarPorId(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  avancar = async (req, res) => {
    const resultado = await this.service.avancar(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  cancelar = async (req, res) => {
    const resultado = await this.service.cancelar(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  historico = async (req, res) => {
    const resultado = await this.service.historico(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  atribuirMotorista = async (req, res) => {
    const resultado = await this.service.atribuirMotorista(req.params.id, req.body.motoristaId);
    return res.status(resultado.status).json(resultado.dados);
  };
}