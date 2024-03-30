import { Editora } from '../../entities';
import { editoraRepository } from '../../repositories/editoraRepository';

interface IBody {
    nome?: string,
}

interface IResponseErros {
    status: number;
    default?: string;
    body?: IBody;
}

export const create = async (editora: Omit<Editora, 'id' | 'data_criacao' | 'data_atualizacao' | 'livro'>): Promise<number | Error> => {

    try {

        const { nome } = editora;

        const editorasCadastradas = await editoraRepository.findAndCount({
            where: [
                { nome: nome },
            ]
        });

        const propriedades: IBody = {};

        if (editorasCadastradas[1] > 0) {

            if (editorasCadastradas[0].some(editora => editora.nome === nome)) {
                propriedades.nome = 'Já existe editora com este nome.';
            }
        }

        if (editorasCadastradas[1] > 0) {

            const erro: IResponseErros = {
                status: 400,
                default: 'Editora já cadastrado com essas informações.',
                body: propriedades
            };

            return new Error(JSON.stringify(erro));
        }

        if (editorasCadastradas[1] > 0) {
            return new Error('Editora já cadastrado');
        }

        const newEditora = editoraRepository.create({
            ...editora,
        });

        const result = await editoraRepository.save(newEditora);

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