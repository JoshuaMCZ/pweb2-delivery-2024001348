export class EntregasService {
  constructor(repository, motoristasRepository) {
    this.repository = repository;
    this.motoristasRepository = motoristasRepository
  }

  async criar({ descricao, origem, destino }) {
    if (!descricao || !origem || !destino) {
      return { erro: 'descricao, origem e destino são obrigatórios', status: 400 };
    }

    if (origem === destino) {
      return { erro: 'origem e destino devem ser diferentes', status: 400 };
    }

    const duplicada = await this.repository.buscarAtivaPorDados(
      descricao,
      origem,
      destino
    );

    if (duplicada) {
      return { erro: 'já existe uma entrega ativa com os mesmos dados', status: 409 };
    }

    const entrega = {
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

    return { dados: await this.repository.criar(entrega), status: 201 };
  }

  async listar(status) {
    const filtros = {};

    if (status !== undefined) {
      filtros.status = status;
    }

    return { dados: await this.repository.listarTodos(filtros), status: 200 };
  }

  async buscarPorId(id) {
    const entrega = await this.repository.buscarPorId(id);

    if (!entrega) {
      return { erro: 'entrega não encontrada', status: 404 };
    }

    return { dados: entrega, status: 200 };
  }

  async avancar(id) {
    const resultado = await this.buscarPorId(id);

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

    await this.repository.atualizar(entrega.id, {
      status: proximoStatus
    });
    
    await this.repository.adicionarEvento(entrega.id, {
      data: new Date().toISOString(),
      descricao: `Status alterado para ${proximoStatus}`
    });

    return { dados: await this.repository.buscarPorId(entrega.id), status: 200 };
  }

  async cancelar(id) {
    const resultado = await this.buscarPorId(id);

    if (resultado.erro) {
      return resultado;
    }

    const entrega = resultado.dados;

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      return { erro: 'entrega não pode ser cancelada neste estado', status: 422 };
    }

    await this.repository.atualizar(entrega.id, {status: 'CANCELADA'});

    await this.repository.adicionarEvento(entrega.id, {
      data: new Date().toISOString(),
      descricao: 'Entrega cancelada'
    });

    return { dados: await this.repository.buscarPorId(entrega.id), status: 200 };
  }

  async historico(id) {
    const resultado = await this.buscarPorId(id);

    if (resultado.erro) {
      return resultado;
    }

    return { dados: resultado.dados.historico, status: 200 };
  }

  async atribuirMotorista(id, motoristaId) {
    const entrega = await this.repository.buscarPorId(id);

    if (!entrega) {
      return {dados: {erro: 'Entrega não encontrada'}, status: 404};
    }

    const motorista = await this.motoristasRepository.buscarPorId(motoristaId);

    if (!motorista) {
      return {dados: {erro: 'Motorista não encontrado'},status: 404};
    }

    if (entrega.status !== 'CRIADA') {
      return {dados: {erro: 'Entrega não está no status CRIADA'},status: 422};
    }

    if (motorista.status !== 'ATIVO') {
      return {dados: {erro: 'Motorista está INATIVO'},status: 422};
    }

    const entregaAtualizada = await this.repository.atualizar( entrega.id, { motoristaId: motorista.id } );

    return {dados: entregaAtualizada,status: 200};
  }
}