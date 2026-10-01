export class Database {
  constructor() {
    this.entregas = [];
    this.proximoIdEntrega = 1;
    this.motoristas = [];
    this.proximoIdMotoristas = 1;
  }

  gerarIdEntrega() {
    return this.proximoIdEntrega++;
  }

  gerarIdMotorista() {
    return this.proximoIdMotoristas++;
  }
}