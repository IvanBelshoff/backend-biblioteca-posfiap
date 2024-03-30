import { Editora, Livro } from '../../database/entities';

export interface IBodyPropsLivros extends Omit<Livro, 'id' | 'data_criacao' | 'data_atualizacao' | 'editora'> { editora?: number }

export interface IBodyPropsEditoras extends Omit<Editora, 'id' | 'data_criacao' | 'data_atualizacao' | 'livro'> { }

export interface IResponseErrosLivros {
    status: number;
    default?: string;
    body?: {
        isbn?: string,
    }
}

export interface IResponseErrosEditoras {
    status: number;
    default?: string;
    body?: {
        nome?: string,
    }
}

export interface IQueryLivros {
    page?: number,
    limit?: number,
    livro?: string,
    isbn?: string,
}

export interface IQueryEditoras {
    page?: number,
    limit?: number,
    nome?: string,
    livro?: string,
}

export interface IParamsIdGlobal { id?: number }

export interface IQueryGetAllLogs {
    page?: number,
    limit?: number,
    acao?: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'PATCH'
    status?: number
    metodo?: string,
    level?: string,
    ip_client?: string,
    response?: string
    data_inicial?: Date,
    data_final?: Date
}

export interface IBodyPropsIdsLivros { livros: number[] }