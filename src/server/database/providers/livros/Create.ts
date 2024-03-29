import { Livro } from '../../entities';
import { livroRepository } from '../../repositories/livroRepository';

interface IBody {
    isbn?: string,
}

interface IResponseErros {
    status: number;
    default?: string;
    body?: IBody;
}

export const create = async (livro: Omit<Livro, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<number | Error> => {

    try {

        const { isbn } = livro;

        const livrosCadastrados = await livroRepository.findAndCount({
            where: [
                { isbn: isbn },
            ]
        });

        const propriedades: IBody = {};

        if (livrosCadastrados[1] > 0) {

            if (livrosCadastrados[0].some(livro => livro.isbn === isbn)) {
                propriedades.isbn = 'Já existe livro com este isbn.';
            }
        }

        if (livrosCadastrados[1] > 0) {

            const erro: IResponseErros = {
                status: 400,
                default: 'Livro já cadastrado com essas informações.',
                body: propriedades
            };

            return new Error(JSON.stringify(erro));
        }

        if (livrosCadastrados[1] > 0) {
            return new Error('Livro já cadastrado');
        }

        const newComputador = livroRepository.create({
            ...livro,
        });

        const result = await livroRepository.save(newComputador);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};