import { Editora } from '../../entities';
import { editoraRepository } from '../../repositories/editoraRepository';

export const getAll = async (
    page?: number,
    limit?: number,
    nome?: string,
    livro?: string,
): Promise<Editora[] | Error> => {
    try {

        const result = editoraRepository.createQueryBuilder('editora')
            .leftJoinAndSelect('editora.livro', 'livro')
            .orderBy('editora.nome', 'ASC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.skip((page - 1) * limit);
            result.take(limit);
        }

        if (typeof nome === 'string') {
            result.andWhere('LOWER(editora.nome) LIKE LOWER(:nome)', { nome: `%${nome}%` });
        }

        if (typeof livro === 'string') {
            result.andWhere('LOWER(livro.titulo) LIKE LOWER(:livro)', { livro: `%${livro}%` });
        }

        const editoras = await result.getMany();

        return editoras;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
