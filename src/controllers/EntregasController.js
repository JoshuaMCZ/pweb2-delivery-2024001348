import { validationResult } from 'express-validator';

export class EntregasController {
  constructor(service, motoristasService) {
    this.service = service;
    this.motoristasService = motoristasService;
  }

  listar = async (req, res) => {
    const resultado = await this.service.listar(req.query.status);

    return res.status(resultado.status).render('entregas/index', {
      titulo: 'Entregas',
      entregas: resultado.dados,
      status: req.query.status || ''
    });
  };

  nova = (req, res) => {
    return res.render('entregas/nova', {
      titulo: 'Nova entrega',
      valores: {},
      erros: []
    });
  };

  criar = async (req, res) => {
    const valores = {
      descricao: req.body.descricao || '',
      origem: req.body.origem || '',
      destino: req.body.destino || ''
    };

    const validacao = validationResult(req);

    if (!validacao.isEmpty()) {
      return res.status(400).render('entregas/nova', {
        titulo: 'Nova entrega',
        valores,
        erros: validacao.array().map(erro => erro.msg)
      });
    }

    const resultado = await this.service.criar(valores);

    if (resultado.erro) {
      return res.status(resultado.status).render('entregas/nova', {
        titulo: 'Nova entrega',
        valores,
        erros: [resultado.erro]
      });
    }

    req.flash('sucesso', 'Entrega criada com sucesso.');
    return res.redirect('/entregas');
  };
  
  buscarPorId = async (req, res) => {
    const resultado = await this.service.buscarPorId(req.params.id);

    if (resultado.erro) {
      return res.status(resultado.status).render('erros/404', {
        titulo: 'Entrega não encontrada'
      });
    }

    const motoristas = await this.motoristasService.listar();

    return res.render('entregas/show', {
      titulo: 'Detalhes da entrega',
      entrega: resultado.dados,
      motoristas: motoristas.dados
    });
  };

  avancar = async (req, res) => {
    const resultado = await this.service.avancar(req.params.id);

    if (resultado.erro) {
      req.flash('erro', resultado.erro);
    } else {
      req.flash('sucesso', 'Status da entrega atualizado.');
    }

    return res.redirect(`/entregas/${req.params.id}`);
  };

  cancelar = async (req, res) => {
    const resultado = await this.service.cancelar(req.params.id);

    if (resultado.erro) {
      req.flash('erro', resultado.erro);
    } else {
      req.flash('sucesso', 'Entrega cancelada.');
    }

    return res.redirect(`/entregas/${req.params.id}`);
  };

  atribuirMotorista = async (req, res) => {
    const resultado = await this.service.atribuirMotorista(
      req.params.id,
      req.body.motoristaId
    );

    if (resultado.status >= 400) {
      req.flash('erro', resultado.erro || resultado.dados?.erro || 'Não foi possível atribuir o motorista.');
    } else {
      req.flash('sucesso', 'Motorista atribuído com sucesso.');
    }

    return res.redirect(`/entregas/${req.params.id}`);
  };
}