import { livroRepository } from '../../repositories/livroRepository';

export const count = async (
    livro?: string,
    isbn?: string,
): Promise<number | Error> => {
    try {

        const result = livroRepository.createQueryBuilder('livro')
            .orderBy('livro.titulo', 'ASC');

        if (typeof livro === 'string') {
            result.andWhere('LOWER(livro.titulo) LIKE LOWER(:livro)', { livro: `%${livro}%` });
        }

        if (typeof isbn === 'string') {
            result.andWhere('LOWER(livro.isbn) LIKE LOWER(:isbn)', { isbn: `%${isbn}%` });
        }

        const count = await result.getCount();

        if (Number.isInteger(Number(count))) {
            return Number(count);
        }

        return new Error('Erro ao consultar a quantidade total de registros');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};