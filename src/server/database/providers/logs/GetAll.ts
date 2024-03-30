import { Log } from '../../entities';
import { logRepository } from '../../repositories/logRepository';

export const getAll = async (
    page?: number,
    limit?: number,
    acao?: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'PATCH',
    status?: number,
    metodo?: string,
    level?: string,
    ip_client?: string,
    response?: string,
    data_inicial?: Date,
    data_final?: Date,
): Promise<Log[] | Error> => {
    try {

        const result = logRepository.createQueryBuilder('log')
            .orderBy('log.id', 'ASC');

        if (page && (typeof page == 'string' || typeof page == 'number') && limit && (typeof limit == 'string' || typeof limit == 'number')) {
            result.skip((page - 1) * limit);
            result.take(limit);
        }

        if (typeof acao === 'string') {
            result.andWhere('log.acao = :acao', { acao: acao });
        }

        if (typeof status === 'string') {
            result.andWhere('log.status = :status', { status: status });
        }

        if (typeof metodo === 'string') {
            result.andWhere('LOWER(log.metodo) LIKE LOWER(:metodo)', { metodo: `%${metodo}%` });
        }

        if (typeof level === 'string') {
            result.andWhere('log.level = :level', { level: level });
        }

        if (typeof ip_client === 'string') {
            result.andWhere('log.client_ip = :ip_client', { ip_client: ip_client });
        }

        if (typeof response === 'string') {
            result.andWhere('log.response = :response', { response: response });
        }

        if (typeof data_inicial === 'string' && typeof data_final === 'string') {
            result.andWhere('log.data BETWEEN :data_inicial AND :data_final', {
                data_inicial: data_inicial,
                data_final: data_final,
            });
        }

        const logs = await result.getMany();

        return logs;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};