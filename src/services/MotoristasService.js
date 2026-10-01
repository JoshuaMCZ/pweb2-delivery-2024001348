export class MotoristasService {
    constructor(repository) {
        this.repository = repository;
    }

    listar() {
        return {
        dados: this.repository.listarTodos(), status: 200
        };
    }


    criar(dados) {
        if (!dados.nome || !dados.cpf) {
        return {
            dados: {erro: 'nome e cpf são obrigatórios'}, status: 400};
        }

        const motoristaExistente = this.repository.buscarPorCpf(dados.cpf);

        if (motoristaExistente) {
        return {dados: {erro: 'CPF já cadastrado'},status: 409};
        };

        const motorista = this.repository.criar({
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo
        });

        return {dados: motorista,status: 201};
  }
}