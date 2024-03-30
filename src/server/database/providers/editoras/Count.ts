import { editoraRepository } from '../../repositories/editoraRepository';

export const count = async (
    nome?: string,
    livro?: string,
): Promise<number | Error> => {
    try {

        const result = editoraRepository.createQueryBuilder('editora')
            .leftJoinAndSelect('editora.livro', 'livro')
            .orderBy('editora.nome', 'ASC');

        if (typeof nome === 'string') {
            result.andWhere('LOWER(editora.nome) LIKE LOWER(:nome)', { nome: `%${nome}%` });
        }

        if (typeof livro === 'string') {
            result.andWhere('LOWER(livro.titulo) LIKE LOWER(:livro)', { livro: `%${livro}%` });
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