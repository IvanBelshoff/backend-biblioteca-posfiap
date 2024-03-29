import { Livro } from '../../entities';
import { livroRepository } from '../../repositories/livroRepository';

export const getById = async (id: number): Promise<Livro | Error> => {

    try {
        const result = await livroRepository.findOne({
            where: {
                id: id
            }
        });

        if (result) {
            return result;
        }

        return new Error('Registro não encontrado');

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};