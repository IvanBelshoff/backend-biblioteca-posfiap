import { Livro } from '../../entities';
import { livroRepository } from '../../repositories/livroRepository';

export const getAll = async (
    page?: number,
    limit?: number,
    livro?: string,
    isbn?: string,
): Promise<Livro[] | Error> => {
    try {

        const result = livroRepository.createQueryBuilder('livro')
            .orderBy('livro.titulo', 'ASC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.skip((page - 1) * limit);
            result.take(limit);
        }

        if (typeof livro === 'string') {
            result.andWhere('LOWER(livro.titulo) LIKE LOWER(:livro)', { livro: `%${livro}%` });
        }

        if (typeof isbn === 'string') {
            result.andWhere('LOWER(livro.isbn) LIKE LOWER(:isbn)', { isbn: `%${isbn}%` });
        }

        const livros = await result.getMany();

        return livros;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
