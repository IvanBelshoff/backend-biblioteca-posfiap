import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IQueryLivros } from '../../shared/interfaces';
import { LivrosProvider } from '../../database/providers/livros';


export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryLivros>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        livro: yup.string().optional(),
        isbn: yup.string().optional(),
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryLivros>, res: Response) => {

    const result = await LivrosProvider.getAll(
        req.query.page,
        req.query.limit,
        req.query.livro,
        req.query.isbn
    );

    const count = await LivrosProvider.count(
        req.query.livro,
        req.query.isbn
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
