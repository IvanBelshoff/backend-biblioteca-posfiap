import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { IQueryGetAllLogs } from '../../shared/interfaces';
import { LogsProvider } from '../../database/providers/logs';

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryGetAllLogs>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        acao: yup.string().oneOf(['GET', 'POST', 'DELETE', 'UPDATE', 'PATCH'], 'tipo de ação invalida').optional(),
        status: yup.number().integer().optional().default(0),
        metodo: yup.string().optional(),
        level: yup.string().optional(),
        ip_client: yup.string().optional(),
        response: yup.string().optional(),
        data_inicial: yup.date().optional(),
        data_final: yup.date().when('data_inicial', {
            is: (dataInicial: Date) => dataInicial,
            then: (schema) => schema.required('Data final é obrigatória quando data inicial é informada')
                .min(yup.ref('data_inicial'), 'Data final deve ser posterior à data inicial'),
            otherwise: (schema) => schema.optional(),
        }),
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryGetAllLogs>, res: Response) => {

    const result = await LogsProvider.getAll(
        req.query.page || 1,
        req.query.limit || 20,
        req.query.acao,
        req.query.status,
        req.query.metodo,
        req.query.level,
        req.query.ip_client,
        req.query.response,
        req.query.data_inicial,
        req.query.data_final
    );

    const count = await LogsProvider.count(
        req.query.acao,
        req.query.status,
        req.query.metodo,
        req.query.level,
        req.query.ip_client,
        req.query.response,
        req.query.data_inicial,
        req.query.data_final
    );

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    } else if (count instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: count.message }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};