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

export const updateById = async (id: number, editora: Omit<Editora, 'id' | 'data_criacao' | 'data_atualizacao' | 'livro'>): Promise<void | Error> => {

    try {

        const { nome } = editora;

        const result = await editoraRepository.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error(JSON.stringify({ status: 404, default: 'Editora não existe' }));
        }

        const editorasCadastradas = await editoraRepository.findAndCount({
            where: [
                { nome: nome },
            ]
        });

        const propriedades: IBody = {};

        const camposDuplicados = editorasCadastradas[0].filter(editora => editora.id !== id);

        if (camposDuplicados.length > 0) {
            if (camposDuplicados.some(editoras => editoras.nome === nome)) {
                propriedades.nome = 'Já existe editora com este nome.';
            }
        }

        if (editorasCadastradas[1] > 0 && editorasCadastradas[0].filter(editora => editora.id !== id).length > 0) {

            const erro: IResponseErros = {
                status: 400,
                default: 'Editora já cadastrada com essas informações.',
                body: propriedades
            };

            return new Error(JSON.stringify(erro));
        }


        if (result) {
            await editoraRepository.update({ id: id }, {
                ...editora,
            });

            return;
        }

        return new Error(JSON.stringify({ status: 400, default: 'Livro já cadastrado com essas informações.' }));
    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};
