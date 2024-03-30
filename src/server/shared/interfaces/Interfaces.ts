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