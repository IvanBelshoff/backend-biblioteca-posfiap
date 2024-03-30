import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IBodyPropsEditoras, IResponseErrosEditoras } from '../../shared/interfaces';
import { EditorasProvider } from '../../database/providers/editoras';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyPropsEditoras>(yup.object().shape({
        nome: yup.string().required().min(5),
    })),
}));

export const create = async (req: Request<{}, {}, IBodyPropsEditoras>, res: Response) => {

    const result = await EditorasProvider.create(req.body);

    if (result instanceof Error) {
        const response: IResponseErrosEditoras = JSON.parse(result.message);
        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(result.message)
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};

