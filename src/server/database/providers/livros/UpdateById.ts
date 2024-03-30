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

export const updateById = async (id: number, livro: Omit<Livro, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<void | Error> => {

    try {

        const { isbn, ano_publicacao } = livro;

        const result = await livroRepository.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error(JSON.stringify({ status: 404, default: 'Livro não existe' }));
        }

        if (typeof ano_publicacao != 'object') {
            return new Error(JSON.stringify({ status: 400, default: 'Formato digitado é invalido' }));
        }

        const livrosCadastrados = await livroRepository.findAndCount({
            where: [
                { isbn: isbn },
            ]
        });

        const propriedades: IBody = {};

        const camposDuplicados = livrosCadastrados[0].filter(livro => livro.id !== id);

        if (camposDuplicados.length > 0) {
            if (camposDuplicados.some(livros => livros.isbn === isbn)) {
                propriedades.isbn = 'Já existe livro com este isbn.';
            }
        }

        if (livrosCadastrados[1] > 0 && livrosCadastrados[0].filter(computer => computer.id !== id).length > 0) {

            const erro: IResponseErros = {
                status: 400,
                default: 'Livro já cadastrado com essas informações.',
                body: propriedades
            };

            return new Error(JSON.stringify(erro));
        }


        if (result) {
            await livroRepository.update({ id: id }, {
                ...livro,
            });

            return;
        }

        return new Error(JSON.stringify({ status: 400, default: 'Livro já cadastrado com essas informações.' }));
    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};
