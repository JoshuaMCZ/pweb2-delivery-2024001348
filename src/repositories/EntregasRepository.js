import prisma from '../database/Database.js';

export class EntregasRepository {
  /**
  Cria uma entrega e seu primeiro evento de histórico.
  @param {Object} entrega Dados da entrega.
  @returns {Promise<Object>} Entrega criada.
  */
  async criar(entrega) {
    const { historico = [], ...dados } = entrega;

    return prisma.entrega.create({
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status ?? 'CRIADA',
        motoristaId: dados.motoristaId ?? null,
        historico: {create: historico.map((evento) => ({data: evento.data, descricao: evento.descricao}))}
      },

      include: {historico: true}

    });
  }

  /**
  Lista todas as entregas, podendo usar filtros.
  @param {Object} [filtros] - Filtros opcionais.
  @returns {Array} Lista de entregas encontradas.
  */
  async listarTodos(filtros = {}) {
    const where = {};

    if (filtros.status !== undefined) {where.status = filtros.status;}

    if (filtros.motoristaId !== undefined) {
      where.motoristaId = Number(filtros.motoristaId);
    }

    return prisma.entrega.findMany({where,include: {historico: true}});
  }

  /**
  Busca uma entrega pelo ID.
  @param {number} id - ID da entrega.
  @returns {Promise<Object|null>} A entrega encontrada ou null caso não exista.
  */
  async buscarPorId(id) {
    return prisma.entrega.findUnique({
      where: {id: Number(id) }, 
      include: {historico: true}});
  }

  /**
  Atualiza uma entrega.
  @param {number|Object} id - ID da entrega.
  @param {Object} [dados] - Dados que serão utilizados na atualização.
  @returns {Promise<Object|null>} A entrega atualizada ou null caso não exista.
  */
  async atualizar(id, dados) {
    const entregaExistente = await prisma.entrega.findUnique({where: { id: Number(id) }});

    if (!entregaExistente) {return null;}

    const { historico, id: idIgnorado, ...dadosAtualizaveis } = dados;

    return prisma.entrega.update({
      where: { id: Number(id) },
      data: dadosAtualizaveis,
      include: {historico: true}
    });
  }

  /**
  Busca uma entrega ativa pelos seus dados.
  @param {string} descricao - Descrição da entrega.
  @param {string} origem - Origem da entrega.
  @param {string} destino - Destino da entrega.
  @returns {Promise<Object|null>} A entrega encontrada ou null caso não exista.
  */
  async buscarAtivaPorDados(descricao, origem, destino) {
    return prisma.entrega.findFirst({
      where: {
        descricao,
        origem,
        destino,
        status: {notIn: ['ENTREGUE', 'CANCELADA']}
      },
      include: {historico: true}
    });
  }

  /**
  Adiciona um evento ao histórico de uma entrega.
  @param {number|string} entregaId Identificador da entrega.
  @param {Object} evento Dados do evento.
  @returns {Promise<Object>} Evento criado.
  */
  async adicionarEvento(entregaId, evento) {
    return prisma.evento.create({
      data: {
        data: evento.data,
        descricao: evento.descricao,
        entregaId: Number(entregaId)
      }
    });
  }
}