import { AppDataSource } from '../data-source';
import { Log } from '../entities';

export const logRepository = AppDataSource.getRepository(Log);