export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  gerarId() {
    return this.database.gerarIdEntrega();
  }

  
  /**
  Cria uma nova entrega.
  @param {Object} entrega - Dados da entrega.
  @returns {Object} A entrega criada.
  */
  criar(entrega) {
    this.database.entregas.push(entrega);
    return entrega;
  }

  /**
  Lista todas as entregas, podendo usar filtros.
  @param {Object} [filtros] - Filtros opcionais.
  @returns {Array} Lista de entregas.
  */
  listarTodos(filtros = {}) {
    return this.database.entregas.filter((entrega) => {
      if (filtros.status !== undefined && entrega.status !== filtros.status) {
        return false;
      }

      if (filtros.motoristaId !== undefined && entrega.motoristaId !== Number(filtros.motoristaId)) {
        return false;
      }

      return true;
    });
  }

  /**
  Busca uma entrega pelo ID.
    @param {number} id - ID da entrega.
  @returns {Object|null} A entrega encontrada ou null caso não exista.
  */
  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === Number(id)) ?? null;
  }

  /**
  Atualiza uma entrega.
  @param {number|Object} id - ID da entrega ou entrega completa, na forma antiga.
  @param {Object} [dados] - Dados que serão utilizados na atualização.
  @returns {Object|null} A entrega atualizada ou null caso não exista.
  */
  atualizar(id, dados) {
    const indice = this.database.entregas.findIndex(
    (item) => item.id === Number(id)
    );

    if (indice === -1) {
      return null;
    }

    this.database.entregas[indice] = {
      ...this.database.entregas[indice],
      ...dados,
      id: Number(id)
    };

    return this.database.entregas[indice];
  }

  /**
  Busca uma entrega ativa pelos seus dados.
  @param {string} descricao - Descrição da entrega.
  @param {string} origem - Origem da entrega.
  @param {string} destino - Destino da entrega.
  @returns {Object|null} A entrega encontrada ou null caso não exista.
  */
  buscarAtivaPorDados(descricao, origem, destino) {
    return this.database.entregas.find(
      (entrega) =>
        entrega.descricao === descricao &&
        entrega.origem === origem &&
        entrega.destino === destino &&
        entrega.status !== 'ENTREGUE' &&
        entrega.status !== 'CANCELADA'
    ) ?? null;
  }
}