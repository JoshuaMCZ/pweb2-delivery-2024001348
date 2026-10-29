import express from 'express';
import { EntregasRepository } from '../repositories/EntregasRepository.js';
import { EntregasService } from '../services/EntregasService.js';
import { EntregasController } from '../controllers/EntregasController.js';
import { MotoristasRepository } from '../repositories/MotoristasRepository.js';
import { MotoristasService } from '../services/MotoristasService.js';
import { MotoristasController } from '../controllers/MotoristasController.js';
import { validarEntrega, validarMotorista } from '../middlewares/validarFormularios.js';

export function criarRotas() {
  const repository = new EntregasRepository();
  const motoristasRepository = new MotoristasRepository();

  const service = new EntregasService(repository, motoristasRepository);
  const motoristasService = new MotoristasService(motoristasRepository, repository);
  
  const controller = new EntregasController(service, motoristasService);
  const motoristasController = new MotoristasController(motoristasService);

  const router = express.Router();

  router.get('/', (req, res) => {
    res.redirect('/entregas');
  });

  router.get('/entregas', controller.listar);
  router.get('/entregas/nova', controller.nova);
  router.post('/entregas', validarEntrega, controller.criar);
  router.get('/entregas/:id', controller.buscarPorId);
  
  router.patch('/entregas/:id/avancar', controller.avancar);
  router.patch('/entregas/:id/cancelar', controller.cancelar);
  router.patch('/entregas/:id/atribuir', controller.atribuirMotorista);

  router.get('/motoristas', motoristasController.listar);
  router.get('/motoristas/novo', motoristasController.novo);
  router.post('/motoristas', validarMotorista, motoristasController.criar);

  return router;
}