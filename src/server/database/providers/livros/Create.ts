import { Editora, Livro } from '../../entities';
import { editoraRepository } from '../../repositories/editoraRepository';
import { livroRepository } from '../../repositories/livroRepository';

interface IBody {
    isbn?: string,
}

interface IResponseErrors {
    status: number;
    default?: string;
    body?: IBody;
}

interface ILivro extends Omit<Livro, 'id' | 'data_criacao' | 'data_atualizacao' | 'editora'> { editora?: number }

const recuperaEditora = async (id?: number): Promise<Error | Editora | undefined> => {

    if (!id) {
        return undefined;
    }

    const editora = await editoraRepository.findOne({ where: { id: id } });

    if (!editora) {
        return new Error('Editora não encontrada');
    }

    return editora;
};

export const create = async (livro: ILivro): Promise<number | Error> => {
    try {
        const { isbn } = livro;

        const livrosCadastrados = await livroRepository.findAndCount({
            where: [{ isbn: isbn }],
        });

        if (livrosCadastrados[1] > 0) {
            if (livrosCadastrados[0].some(livro => livro.isbn === isbn)) {
                const errors: IResponseErrors = {
                    status: 400,
                    default: 'Livro já cadastrado com essas informações.',
                    body: { isbn: 'Já existe livro com este isbn.' }
                };
                return new Error(JSON.stringify(errors));
            }
        }

        const editora = await recuperaEditora(livro.editora);

        if (editora instanceof Error) {
            return editora;
        }

        const newLivro = livroRepository.create({
            autor: livro.autor,
            ano_publicacao: livro.ano_publicacao,
            isbn: livro.isbn,
            titulo: livro.titulo,
            editora: editora || null // Se não houver editora, atribui null
        });

        const result = await livroRepository.save(newLivro);

        if (typeof result === 'object' && 'id' in result) {
            return result.id;
        } else {
            return new Error('Erro ao cadastrar o registro');
        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};


