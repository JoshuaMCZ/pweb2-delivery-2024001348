export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  gerarId() {
    return this.database.gerarIdEntrega();
  }

  

  criar(entrega) {

    /**
    Cria uma nova entrega.
    @param {Object} entrega - Dados da entrega.
    @returns {Object} A entrega criada.
    */

    this.database.entregas.push(entrega);
    return entrega;
  }

  listarTodos(filtros = {}) {

    /**
    Lista todas as entregas, podendo usar filtros.
    @param {Object} [filtros] - Filtros opcionais.
    @returns {Array} Lista de entregas.
    */

    if (filtros.status !== undefined) {
      return this.database.entregas.filter(
        (entrega) => entrega.status === filtros.status
      );
    }

    return [...this.database.entregas];
  }

  buscarPorId(id) {

    /**
    Busca uma entrega pelo ID.
     @param {number} id - ID da entrega.
    @returns {Object|null} A entrega encontrada ou null caso não exista.
    */

    return this.database.entregas.find((entrega) => entrega.id === Number(id)) ?? null;
  }

  atualizar(id, dados) {

    /**
    Atualiza uma entrega.
    @param {number|Object} id - ID da entrega ou entrega completa, na forma antiga.
    @param {Object} [dados] - Dados que serão utilizados na atualização.
    @returns {Object|null} A entrega atualizada ou null caso não exista.
    */

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

  buscarAtivaPorDados(descricao, origem, destino) {

    /**
    Busca uma entrega ativa pelos seus dados.
    @param {string} descricao - Descrição da entrega.
    @param {string} origem - Origem da entrega.
    @param {string} destino - Destino da entrega.
    @returns {Object|null} A entrega encontrada ou null caso não exista.
    */

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