import prisma from '../database/Database.js';

export class MotoristasRepository {
    /**
    Cria um novo motorista.
    @param {Object} dados Dados do motorista.
    @returns {Promise<Object>} Motorista criado.
    */
    async criar(dados) {
    return prisma.motorista.create({
        data: {
            nome: dados.nome,
            cpf: dados.cpf,
            placaVeiculo: dados.placaVeiculo ?? null,
            status: 'ATIVO'
            }
        });
    }

    /**
    Lista todos os motoristas cadastrados.
    @returns {Promise<Array>} Lista de motoristas.
    */
    async listarTodos() {
        return prisma.motorista.findMany();
    }

    /**
    Busca um motorista pelo ID.
    @param {number} id - ID do motorista.
    @returns {Promise<Object|null>} Motorista encontrado ou null caso não exista.
    */
    async buscarPorId(id) {
        return prisma.motorista.findUnique({
            where: { id: Number(id) }
        });
  }

    /**
    Busca um motorista pelo CPF.
    @param {string} cpf - CPF do motorista.
    @returns {Object|null} Motorista encontrado ou null caso não exista.
    */
    async buscarPorCpf(cpf) {
        return prisma.motorista.findUnique({
            where: { cpf }
        });
  }
}