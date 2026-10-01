export class MotoristasService {
    constructor(repository, entregasRepository) {
        this.repository = repository;
        this.entregasRepository = entregasRepository;
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

    buscarPorId(id) {
        const motorista = this.repository.buscarPorId(id);

        if (!motorista) {return {dados: {erro: 'Motorista não encontrado'}, status: 404};}

        return {dados: motorista, status: 200};
    }

    listarEntregas(id, status) {
        const motorista = this.repository.buscarPorId(id);

        if (!motorista) {
            return {dados: {erro: 'Motorista não encontrado'},status: 404};
        }

        const filtros = {motoristaId: Number(id)};

        if (status !== undefined) {filtros.status = status;}

        return {dados: this.entregasRepository.listarTodos(filtros),status: 200};
  }
}