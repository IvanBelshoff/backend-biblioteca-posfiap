import * as create from './Create';
import * as DeleteById from './DeleteById';
import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetById from './GetById';
import * as UpdateById from './UpdateById';
import * as UpdateLivrosByIds from './UpdateLivrosByIds';

export const EditorasProvider = {
    ...create,
    ...DeleteById,
    ...GetAll,
    ...Count,
    ...GetById,
    ...UpdateById,
    ...UpdateLivrosByIds
};