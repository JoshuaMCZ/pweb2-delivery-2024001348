import { validationResult } from 'express-validator';

export class MotoristasController {
    constructor(service) {
        this.service = service;
    }

    listar = async (req, res) => {
        const resultado = await this.service.listar();

        return res.status(resultado.status).render('motoristas/index', {
            titulo: 'Motoristas',
            motoristas: resultado.dados
        });
    };

    novo = (req, res) => {
        return res.render('motoristas/novo', {
            titulo: 'Novo motorista',
            valores: {},
            erros: []
        });
    };

    criar = async (req, res) => {
        const valores = {
            nome: req.body.nome || '',
            cpf: req.body.cpf || ''
        };

        const validacao = validationResult(req);

        if (!validacao.isEmpty()) {
            return res.status(400).render('motoristas/novo', {
                titulo: 'Novo motorista',
                valores,
                erros: validacao.array().map(erro => erro.msg)
            });
        }

        const resultado = await this.service.criar(valores);
        const erro = resultado.erro || resultado.dados?.erro;

        if (erro) {
            return res.status(resultado.status).render('motoristas/novo', {
                titulo: 'Novo motorista',
                valores,
                erros: [erro]
            });
        }

        req.flash('sucesso', 'Motorista cadastrado com sucesso.');
        return res.redirect('/motoristas');
    };

    buscarPorId = async (req, res) => {
        const resultado = await this.service.buscarPorId(req.params.id);
        return res.status(resultado.status).json(resultado.dados);
    };

    listarEntregas = async (req, res) => {
        const resultado = await this.service.listarEntregas(req.params.id, req.query.status);
        return res.status(resultado.status).json(resultado.dados);
    };

    atribuirMotorista = async (req, res) => {
        const resultado = await this.service.atribuirMotorista(req.params.id,req.body.motoristaId);
        return res.status(resultado.status).json(resultado.dados);
    };
}