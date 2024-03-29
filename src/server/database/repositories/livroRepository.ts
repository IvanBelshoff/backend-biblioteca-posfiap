import { AppDataSource } from '../data-source';
import { Livro } from '../entities';

export const livroRepository = AppDataSource.getRepository(Livro);