import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IBodyPropsLivros, IResponseErrosLivros } from '../../shared/interfaces';
import { LivrosProvider } from '../../database/providers/livros';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsLivros>(yup.object().shape({
        titulo: yup.string().required().min(5),
        autor: yup.string().required().min(5),
        isbn: yup.string().required().min(6),
        ano_publicacao: yup.date().required(),
        editora: yup.number().optional().min(0),
    })),
}));

export const create = async (req: Request<{}, {}, IBodyPropsLivros>, res: Response) => {

    const result = await LivrosProvider.create({
        ...req.body,
        ano_publicacao: new Date(String(req.body.ano_publicacao))
    });

    if (result instanceof Error) {
        const response: IResponseErrosLivros = JSON.parse(result.message);
        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(result.message)
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};

