export class MotoristasRepository {
    constructor(database) {
        this.database = database;
    }

    /**
    Lista todos os motoristas cadastrados.
    @returns {Array<Object>} Lista de motoristas.
    */
    listarTodos() {
        return [...this.database.motoristas];
    }

    /**
    Busca um motorista pelo CPF.
    @param {string} cpf - CPF do motorista.
    @returns {Object|null} Motorista encontrado ou null caso não exista.
    */
    buscarPorCpf(cpf) {
        return (
        this.database.motoristas.find(
            (motorista) => motorista.cpf === cpf
        ) || null
        );
    }

    /**
    Cria um novo motorista.
    @param {Object} dados - dados do motorista.
    @returns {Object} O motorista criado.
    */
    criar(dados) {

        const motorista = {
            id: this.database.gerarIdMotorista(),
            nome: dados.nome,
            cpf: dados.cpf,
            placaVeiculo: dados.placaVeiculo,
            status: 'ATIVO'
        };

        this.database.motoristas.push(motorista);
        return motorista;
    }
}