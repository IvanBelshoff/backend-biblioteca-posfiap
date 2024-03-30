import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IQueryEditoras } from '../../shared/interfaces';
import { EditorasProvider } from '../../database/providers/editoras';


export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryEditoras>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        nome: yup.string().optional(),
        livro: yup.string().optional(),
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryEditoras>, res: Response) => {

    const result = await EditorasProvider.getAll(
        req.query.page,
        req.query.limit,
        req.query.nome,
        req.query.livro
    );

    const count = await EditorasProvider.count(
        req.query.nome,
        req.query.livro
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
