import { AppDataSource } from '../data-source';
import { Editora } from '../entities';

export const editoraRepository = AppDataSource.getRepository(Editora);