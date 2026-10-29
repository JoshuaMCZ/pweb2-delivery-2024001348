import { body } from 'express-validator';

export const validarEntrega = [
    body('descricao')
        .trim()
        .notEmpty()
        .withMessage('A descrição é obrigatória.'),

    body('origem')
        .trim()
        .notEmpty()
        .withMessage('A origem é obrigatória.'),

    body('destino')
        .trim()
        .notEmpty()
        .withMessage('O destino é obrigatório.')
        .bail()
        .custom((destino, { req }) => {
            if (destino === req.body.origem) {
                throw new Error('A origem e o destino devem ser diferentes.');
            }

            return true;
        })
];

export const validarMotorista = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('O nome é obrigatório.'),

    body('cpf')
        .trim()
        .notEmpty()
        .withMessage('O CPF é obrigatório.')
        .bail()
        .matches(/^\d{11}$/)
        .withMessage('O CPF deve conter 11 dígitos.')
];