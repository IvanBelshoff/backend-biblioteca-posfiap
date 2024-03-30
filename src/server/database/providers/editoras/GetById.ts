import { Editora } from '../../entities';
import { editoraRepository } from '../../repositories/editoraRepository';

export const getById = async (id: number): Promise<Editora | Error> => {

    try {
        const result = await editoraRepository.findOne({
            relations: {
                livro: true
            },
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