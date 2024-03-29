import * as create from './Create';
import * as GetAll from './GetAll';
import * as Count from './Count';
import * as UpdateById from './UpdateById';
import * as DeleteById from './DeleteById';
import * as GetById from './GetById';

export const LivrosProvider = {
    ...create,
    ...GetAll,
    ...Count,
    ...UpdateById,
    ...DeleteById,
    ...GetById
};