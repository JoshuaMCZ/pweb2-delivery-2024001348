export class Database {
  constructor() {
    this.entregas = [];
    this.proximoIdEntrega = 1;
    this.motoristas = [];
  }

  gerarIdEntrega() {
    return this.proximoIdEntrega++;
  }
}