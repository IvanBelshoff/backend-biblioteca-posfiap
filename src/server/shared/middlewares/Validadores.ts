import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Log } from '../../database/entities';
import { logRepository } from '../../database/repositories/logRepository';
import logger from './logger';



const RegistraLog = (metodo: string) => {

    const logLevel = (statusCode: number): string => {
        if (statusCode >= 500) {
            return 'error';
        } else if (statusCode >= 400) {
            return 'warn';
        } else {
            return 'info';
        }
    };

    const salvarLogNoBancoDeDados = async (logData: Omit<Log, 'id'>) => {

        try {

            const newLog = logRepository.create({ ...logData });

            const log = await logRepository.save(newLog);

            if (log instanceof Error) {
                return log;
            }

            logger.info('Log salvo no banco de dados:', logData); // Registre que o log foi salvo com sucesso

        } catch (error) {
            logger.error('Erro ao salvar log no banco de dados:', error); // Registre se houver um erro ao salvar o log
        }
    };

    const registroLog: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

        const { method, originalUrl, headers } = req;
        const startTime = Date.now();

        const hostHeader = headers['host'];

        const [ip, porta] = hostHeader ? hostHeader.split(':') : [undefined, undefined];

        const logData: Omit<Log, 'id'> = {
            acao: method,
            data: new Date(),
            url_requisicao: originalUrl,
            body: req.body,
            query: req.query,
            metodo: metodo,
            level: logLevel(res.statusCode),
            host: ip ? ip : '',
            port: porta ? parseInt(porta) : 0,
            client_ip: req.socket?.remoteAddress ? req.socket.remoteAddress.toString().replace(/^::ffff:/, '') : '',
            user_agent: headers['user-agent'] ? headers['user-agent'].toString() : '',
            referer: headers['referer'] ? headers['referer'].toString() : '',
            params: req.params
        };

        const calcularTempoERegistrarLog = async () => {
            const endTime = Date.now();

            logData.tempo_de_resposta = endTime - startTime; // Tempo de resposta em milissegundos

            logData.status = res.statusCode;

            logData.response = res.statusMessage;

            const log = await salvarLogNoBancoDeDados(logData);

            if (log instanceof Error) {
                return log.message;
            }
            //logger.info('Requisição concluída:', logData);
        };

        res.on('finish', calcularTempoERegistrarLog);

        next();
    };

    return registroLog;
};

export { RegistraLog };