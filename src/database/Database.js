export class Database {
  constructor() {
    this.entregas = [];
    this.proximoIdEntrega = 1;
  }

  gerarIdEntrega() {
    return this.proximoIdEntrega++;
  }
}