export class MotoristasService {
    constructor(repository, entregasRepository) {
        this.repository = repository;
        this.entregasRepository = entregasRepository;
    }

    async listar() {
        return {dados: await this.repository.listarTodos(), status: 200};
    }


    async criar(dados) {
        if (!dados.nome || !dados.cpf) {
        return {
            dados: {erro: 'nome e cpf são obrigatórios'}, status: 400};
        }

        const motoristaExistente = await this.repository.buscarPorCpf(dados.cpf);

        if (motoristaExistente) {
        return {dados: {erro: 'CPF já cadastrado'},status: 409};
        }

        const motorista = await this.repository.criar({
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo
        });

        return {dados: motorista,status: 201};
    }

    async buscarPorId(id) {
        const motorista = await this.repository.buscarPorId(id);

        if (!motorista) {return {dados: {erro: 'Motorista não encontrado'}, status: 404};}

        return {dados: motorista, status: 200};
    }

    async listarEntregas(id, status) {
        const motorista = await this.repository.buscarPorId(id);

        if (!motorista) {
            return {dados: {erro: 'Motorista não encontrado'}, status: 404};
        }

        const filtros = {motoristaId: Number(id)};

        if (status !== undefined) {filtros.status = status;}

        return {dados: await this.entregasRepository.listarTodos(filtros),status: 200};
  }
}