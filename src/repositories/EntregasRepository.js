export class EntregasRepository {
  constructor(database) {
    this.database = database;
  }

  gerarId() {
    return this.database.gerarIdEntrega();
  }

  criar(entrega) {
    this.database.entregas.push(entrega);
    return entrega;
  }

  listar() {
    return [...this.database.entregas];
  }

  buscarPorId(id) {
    return this.database.entregas.find((entrega) => entrega.id === Number(id)) ?? null;
  }

  atualizar(entrega) {
    const indice = this.database.entregas.findIndex((item) => item.id === entrega.id);

    if (indice === -1) {
      return null;
    }

    this.database.entregas[indice] = entrega;
    return entrega;
  }

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

  listarPorStatus(status) {
    return this.database.entregas.filter((entrega) => entrega.status === status);
  }
}