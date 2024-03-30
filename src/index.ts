import 'reflect-metadata';

import { server } from './server/Server';
import { AppDataSource } from './server/database';
import { TypeORMError } from 'typeorm';

AppDataSource.initialize().then(async () => {

    // eslint-disable-next-line quotes
    console.log(`\nBanco de dados conectado\n`);

    server.listen({
        host: '0.0.0.0',
        port: process.env.PORT ? Number(process.env.PORT) : 3333,
    }, async () => {
        console.log('Servidor rodando');
    });


}).catch((error) => {
    console.log(error as TypeORMError);

    if (error.code == String('3D000')) {
        console.log(error);
    }
});
