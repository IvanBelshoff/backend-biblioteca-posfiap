import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LivrosController } from '../controllers/livros';
import { RegistraLog } from '../shared/middlewares';
import { LogsController } from '../controllers/logs';
import { EditorasController } from '../controllers/editoras';

const router = Router();

router.get('/', (_, res) => {
    return res.status(StatusCodes.OK).send('Tudo certo');
});

//Livros
router.post('/livros', RegistraLog('Cadastrar livros'), LivrosController.createValidation, LivrosController.create);
router.get('/livros', RegistraLog('Listar livros'), LivrosController.getAllValidation, LivrosController.getAll);
router.get('/livros/:id', RegistraLog('Resgatar um livro'), LivrosController.getByIdValidation, LivrosController.getById);
router.patch('/livros/:id', RegistraLog('Atualizar um livro'), LivrosController.updataByIdValidation, LivrosController.updateById);
router.delete('/livros/:id', RegistraLog('Deletar um livro'), LivrosController.deleteByIdValidation, LivrosController.deleteById);

//Editoras
router.post('/editoras', RegistraLog('Cadastrar editoras'), EditorasController.createValidation, EditorasController.create);
router.get('/editoras', RegistraLog('Listar editoras'), EditorasController.getAllValidation, EditorasController.getAll);
router.get('/editoras/:id', RegistraLog('Resgatar uma editora'), EditorasController.getByIdValidation, EditorasController.getById);
router.patch('/editoras/:id', RegistraLog('Atualizar um editora'), EditorasController.updataByIdValidation, EditorasController.updateById);
router.patch('/editoras/livros/:id', RegistraLog('Atualiza os livros de uma editora'), EditorasController.updateLivrosByIds, EditorasController.updateLivrosByIdsValidation);
router.delete('/editoras/:id', RegistraLog('Deletar um editora'), EditorasController.deleteByIdValidation, EditorasController.deleteById);

//Logs
router.get('/logs', RegistraLog('Listar logs'), LogsController.getAllValidation, LogsController.getAll);

export { router };