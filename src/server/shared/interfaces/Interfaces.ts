import { Livro } from '../../database/entities';

export interface IBodyPropsLivros extends Omit<Livro, 'id' | 'data_criacao' | 'data_atualizacao'> { }

export interface IResponseErros {
    status: number;
    default?: string;
    body?: {
        isbn?: string,
    }
}

export interface IQueryLivros {
    page?: number,
    limit?: number,
    livro?: string,
    isbn?: string,
}

export interface IParamsIdGlobal { id?: number }