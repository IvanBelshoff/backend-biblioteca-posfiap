import { logRepository } from '../../repositories/logRepository';


export const count = async (
    acao?: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'PATCH',
    status?: number,
    metodo?: string,
    level?: string,
    ip_client?: string,
    response?: string,
    data_inicial?: Date,
    data_final?: Date,
): Promise<number | Error> => {
    try {

        const result = logRepository.createQueryBuilder('log')
            .orderBy('log.acao', 'ASC');

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

        const count = await result.getCount();

        if (Number.isInteger(Number(count))) {
            return Number(count);
        }

        return new Error('Erro ao consultar a quantidade total de registros');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};