import winston from 'winston';

// Configuração do nível de logs
const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Configuração dos transportes (saída dos logs)
const transports = [
    new winston.transports.Console({
        level: level,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
];

// Criação do logger
const logger = winston.createLogger({
    level: level,
    transports: transports,
});

export default logger;