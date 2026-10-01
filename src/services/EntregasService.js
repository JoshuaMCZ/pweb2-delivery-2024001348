export class EntregasService {
  constructor(repository, motoristasRepository) {
    this.repository = repository;
    this.motoristasRepository = motoristasRepository
  }

  criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      return { erro: 'descricao, origem e destino são obrigatórios', status: 400 };
    }

    if (origem === destino) {
      return { erro: 'origem e destino devem ser diferentes', status: 400 };
    }

    if (this.repository.buscarAtivaPorDados(descricao, origem, destino)) {
      return { erro: 'já existe uma entrega ativa com os mesmos dados', status: 409 };
    }

    const entrega = {
      id: this.repository.gerarId(),
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      motoristaId: null,
      historico: [
        {
          data: new Date().toISOString(),
          descricao: 'Entrega criada'
        }
      ]
    };

    return { dados: this.repository.criar(entrega), status: 201 };
  }

  listar(status) {
    const filtros = {};

    if (status !== undefined) {
      filtros.status = status;
    }

    return { dados: this.repository.listarTodos(filtros), status: 200 };
  }

  buscarPorId(id) {
    const entrega = this.repository.buscarPorId(id);

    if (!entrega) {
      return { erro: 'entrega não encontrada', status: 404 };
    }

    return { dados: entrega, status: 200 };
  }

  avancar(id) {
    const resultado = this.buscarPorId(id);

    if (resultado.erro) {
      return resultado;
    }

    const entrega = resultado.dados;
    const proximoStatus = {
      CRIADA: 'EM_TRANSITO',
      EM_TRANSITO: 'ENTREGUE'
    }[entrega.status];

    if (!proximoStatus) {
      return { erro: 'transição de status inválida', status: 422 };
    }

    entrega.status = proximoStatus;
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao: `Status alterado para ${proximoStatus}`
    });

    return { dados: this.repository.atualizar(entrega.id, entrega), status: 200 };
  }

  cancelar(id) {
    const resultado = this.buscarPorId(id);

    if (resultado.erro) {
      return resultado;
    }

    const entrega = resultado.dados;

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      return { erro: 'entrega não pode ser cancelada neste estado', status: 422 };
    }

    entrega.status = 'CANCELADA';
    entrega.historico.push({
      data: new Date().toISOString(),
      descricao: 'Entrega cancelada'
    });

    return { dados: this.repository.atualizar(entrega.id, entrega), status: 200 };
  }

  historico(id) {
    const resultado = this.buscarPorId(id);

    if (resultado.erro) {
      return resultado;
    }

    return { dados: resultado.dados.historico, status: 200 };
  }

  atribuirMotorista(id, motoristaId) {
    const entrega = this.repository.buscarPorId(id);

    if (!entrega) {
      return {dados: {erro: 'Entrega não encontrada'}, status: 404};
    }

    const motorista = this.motoristasRepository.buscarPorId(motoristaId);

    if (!motorista) {
      return {dados: {erro: 'Motorista não encontrado'},status: 404};
    }

    if (entrega.status !== 'CRIADA') {
      return {dados: {erro: 'Entrega não está no status CRIADA'},status: 422};
    }

    if (motorista.status !== 'ATIVO') {
      return {dados: {erro: 'Motorista está INATIVO'},status: 422};
    }

    entrega.motoristaId = motorista.id;

    const entregaAtualizada = this.repository.atualizar(entrega.id, entrega);

    return {dados: entregaAtualizada,status: 200};
  }
}