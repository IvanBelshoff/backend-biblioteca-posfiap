import { livroRepository } from '../../repositories/livroRepository';

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const result = await livroRepository.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Não existe livro com este ID');
        }
        await livroRepository.delete({ id: id });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};