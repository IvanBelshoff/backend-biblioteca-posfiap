import { In } from 'typeorm';
import { Livro } from '../../entities';
import { IBodyPropsIdsLivros } from '../../../shared/interfaces';
import { editoraRepository } from '../../repositories/editoraRepository';
import { livroRepository } from '../../repositories/livroRepository';

const atualizaLivros = async (id: number, livros: number[]): Promise<[] | Livro[] | Error> => {

    const filtroLivrosId: number[] = [];

    const editora = await editoraRepository.findOne({
        relations: {
            livro: true
        },
        where: {
            id: id
        }
    });

    if (editora) {

        const quantidadeLivrosRF = livros.length;

        for (let i = 0; i <= (quantidadeLivrosRF - 1); i++) {

            const filtroLivros = await livroRepository.findOne({
                relations: {
                    editora: true
                },
                where: {
                    id: livros[i]
                }
            });

            if (filtroLivros) {

                if (filtroLivros.editora && filtroLivros.editora.id != editora.id) {
                    return new Error(`Livro ${filtroLivros.titulo} já possui uma editora`);
                }

                if (!filtroLivros.editora || filtroLivros.editora.id == editora.id) {
                    filtroLivrosId.push(
                        filtroLivros.id
                    );
                }
            }
        }

        const livrosFiltrados = await livroRepository.find({ where: { id: In(filtroLivrosId) } });

        const livrosMantidos = editora.livro
            .filter(livro => livrosFiltrados.some(filtrado => filtrado.id === livro.id))
            .map(livro => livro.id);

        const livrosRemovidos = editora.livro
            .filter(livro => !livrosFiltrados.some(filtrado => filtrado.id === livro.id))
            .map(livro => livro.id);

        const livrosAdicionados = livrosFiltrados
            .filter(filtrado => !editora.livro.some(livro => livro.id === filtrado.id))
            .map(livro => livro.id);

        console.log('Livros Mantidos:', livrosMantidos.length, '(' + livrosMantidos.join(',') + ')');
        console.log('Livros Adicionados:', livrosAdicionados.length, '(' + livrosAdicionados.join(',') + ')');
        console.log('Livros Removidos:', livrosRemovidos.length, '(' + livrosRemovidos.join(',') + ')');

        const idsNovosComputadores = [...livrosMantidos, ...livrosAdicionados];

        const novosComputadores = await livroRepository.find({ where: { id: In(idsNovosComputadores) } });

        return novosComputadores;

    } else {
        return [];
    }
};


export const updateLivrosByIds = async (id: number, livro: IBodyPropsIdsLivros): Promise<void | Error> => {

    try {

        const editoraCadastrada = await editoraRepository.findOne({
            relations: {
                livro: true
            },
            where: {
                id
            }
        });

        if (!editoraCadastrada) {
            return new Error('Editora não localizada');
        }

        const idsLivrosCadastrados = editoraCadastrada?.livro.map(livro => livro.id) || [];

        const { livros = livro.livros || idsLivrosCadastrados } = livro;

        const livrosEditoras = await livroRepository.findAndCount({
            where: {
                id: In(livros)
            },
        });

        if (livrosEditoras[1] > 0) {
            editoraCadastrada.livro = livrosEditoras[0];
        }

        if (livro.livros) {

            if (livrosEditoras[1] !== livro.livros?.length) {

                return new Error('Algum livro não foi encontrado.');

            }

            const editorasAtualizados = await atualizaLivros(id, livro.livros);

            if (editorasAtualizados instanceof Error) {

                return new Error(editorasAtualizados.message);

            }
            if (editorasAtualizados) {

                editoraCadastrada.livro = editorasAtualizados;

            }
        }

        await editoraRepository.save(editoraCadastrada);

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};