import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IBodyPropsLivros, IResponseErros } from '../../shared/interfaces';
import { LivrosProvider } from '../../database/providers/livros';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsLivros>(yup.object().shape({
        titulo: yup.string().required().min(3),
        autor: yup.string().required().min(3),
        isbn: yup.string().required().min(3),
        ano_publicacao: yup.date().required()
    })),
}));

export const create = async (req: Request<{}, {}, IBodyPropsLivros>, res: Response) => {

    const result = await LivrosProvider.create(req.body);

    if (result instanceof Error) {
        const response: IResponseErros = JSON.parse(result.message);
        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(result.message)
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};

