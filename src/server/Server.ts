import 'dotenv/config';
import cors from 'cors';
import 'reflect-metadata';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import swegger from 'swagger-ui-express';

import './shared/services/TranslationsYup';
import { router } from './routes';
import swaggerDocs from './shared/services/swegger.json';

const server = express();

server.use(express.json());

server.disable('etag');
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use((req, res, next) => {

    server.use(cors());

    /*
    server.use(cors({
        origin:'https://.google.com'
    }));*/

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

server.use('/documentacao', swegger.serve, swegger.setup(swaggerDocs));

server.use(router);

export { server };