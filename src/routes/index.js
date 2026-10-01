import express from 'express';
import { Database } from '../database/Database.js';
import { EntregasRepository } from '../repositories/EntregasRepository.js';
import { EntregasService } from '../services/EntregasService.js';
import { EntregasController } from '../controllers/EntregasController.js';
import { MotoristasRepository } from '../repositories/MotoristasRepository.js';
import { MotoristasService } from '../services/MotoristasService.js';
import { MotoristasController } from '../controllers/MotoristasController.js';

export function criarRotas() {
  const database = new Database();
  const repository = new EntregasRepository(database);
  const motoristasRepository = new MotoristasRepository(database);
  const service = new EntregasService(repository, motoristasRepository);
  const controller = new EntregasController(service);
  const motoristasService = new MotoristasService(motoristasRepository, repository);
  const motoristasController = new MotoristasController(motoristasService);

  const router = express.Router();

  router.post('/entregas', controller.criar);
  router.get('/entregas', controller.listar);
  router.get('/entregas/:id/historico', controller.historico);
  router.get('/entregas/:id', controller.buscarPorId);
  router.patch('/entregas/:id/avancar', controller.avancar);
  router.patch('/entregas/:id/cancelar', controller.cancelar);
  router.patch('/entregas/:id/atribuir', controller.atribuirMotorista);

  router.post('/motoristas', motoristasController.criar);
  router.get('/motoristas', motoristasController.listar);
  router.get('/motoristas/:id/entregas', motoristasController.listarEntregas);
  router.get('/motoristas/:id', motoristasController.buscarPorId);

  return router;
}