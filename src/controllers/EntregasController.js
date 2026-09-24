export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    const resultado = this.service.criar(req.body ?? {});
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  listar = (req, res) => {
    const resultado = this.service.listar(req.query.status);
    return res.status(resultado.status).json(resultado.dados);
  };

  buscarPorId = (req, res) => {
    const resultado = this.service.buscarPorId(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  avancar = (req, res) => {
    const resultado = this.service.avancar(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  cancelar = (req, res) => {
    const resultado = this.service.cancelar(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };

  historico = (req, res) => {
    const resultado = this.service.historico(req.params.id);
    return res.status(resultado.status).json(
      resultado.erro ? { erro: resultado.erro } : resultado.dados
    );
  };
}