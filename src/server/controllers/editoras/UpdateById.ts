import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IBodyPropsEditoras, IParamsIdGlobal, IResponseErrosEditoras } from '../../shared/interfaces';
import { EditorasProvider } from '../../database/providers/editoras';

export const updataByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsEditoras>(yup.object().shape({
        nome: yup.string().required().min(5),
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateById = async (req: Request<IParamsIdGlobal, {}, IBodyPropsEditoras>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await EditorasProvider.updateById(req.params.id, req.body);

    if (result instanceof Error) {
        const response: IResponseErrosEditoras = JSON.parse(result.message);
        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(result.message)
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
};
