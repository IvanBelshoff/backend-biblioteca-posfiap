import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { IBodyPropsIdsLivros, IParamsIdGlobal } from '../../shared/interfaces';
import { EditorasProvider } from '../../database/providers/editoras';

export const updateLivrosByIdsValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsIdsLivros>(yup.object().shape({
        livros: yup.array().of(yup.number().integer().required().moreThan(0)).required(),
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateLivrosByIds = async (req: Request<IParamsIdGlobal, {}, IBodyPropsIdsLivros>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await EditorasProvider.updateLivrosByIds(req.params.id, { livros: req.body.livros });

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
};
