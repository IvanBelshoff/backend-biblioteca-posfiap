import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IBodyPropsLivros, IParamsIdGlobal, IResponseErros } from '../../shared/interfaces';
import { LivrosProvider } from '../../database/providers/livros';

export const updataByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsLivros>(yup.object().shape({
        titulo: yup.string().required().min(3),
        autor: yup.string().required().min(3),
        isbn: yup.string().required().min(3),
        ano_publicacao: yup.date().required()
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateById = async (req: Request<IParamsIdGlobal, {}, IBodyPropsLivros>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await LivrosProvider.updateById(req.params.id, req.body);

    if (result instanceof Error) {
        const response: IResponseErros = JSON.parse(result.message);
        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(result.message)
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
};
