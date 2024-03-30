import { Editora } from '../../entities';
import { editoraRepository } from '../../repositories/editoraRepository';
import { livroRepository } from '../../repositories/livroRepository';

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const editora = await editoraRepository.findOne({
            relations: {
                livro: true
            },
            where: {
                id: id
            }
        });

        if (!editora) {
            return new Error('Não existe editora com este ID');
        }

        if (editora.livro) {

            const quantidadeLivros = (editora.livro.length - 1);

            for (let i = 0; i <= quantidadeLivros; i++) {

                const removeVinculoComputador = await livroRepository.update({ id: editora.livro[i].id }, { editora: null });

                if (removeVinculoComputador instanceof Error) {
                    return new Error(removeVinculoComputador.message);
                }

                console.log(`${editora.livro[i].titulo} foi desvinculado`);
            }

            console.log('Todos os vinculos foram limpos');

        }

        const deleteEditora = await editoraRepository.createQueryBuilder()
            .delete()
            .from(Editora)
            .where('id = :id', { id: id })
            .execute();

        if (deleteEditora instanceof Error) {
            return new Error(deleteEditora.message);
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};