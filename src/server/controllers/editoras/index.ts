import * as Create from './Create';
import * as DeleteById from './DeleteById';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as UpdateById from './UpdateById';
import * as UpdateLIvrosByIds from './UpdateLivrosByIds';

export const EditorasController = {
    ...Create,
    ...GetAll,
    ...GetById,
    ...DeleteById,
    ...UpdateById,
    ...UpdateLIvrosByIds
};