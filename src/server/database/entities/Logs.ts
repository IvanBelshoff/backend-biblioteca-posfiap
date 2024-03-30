import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Log {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ nullable: false })
    acao: string;

    @Column({ nullable: true })
    status?: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data: Date;

    @Column({ nullable: false })
    url_requisicao: string;

    @Column({ nullable: true })
    response?: string;

    @Column({ nullable: true, type: 'json' })
    body: any;

    @Column({ nullable: true, type: 'json' })
    query: any;

    @Column({ nullable: true, type: 'json' })
    params: any;

    @Column({ nullable: true })
    tempo_de_resposta?: number;

    @Column({ nullable: true })
    metodo: string;

    @Column({ nullable: false })
    level: string;

    @Column({ nullable: true })
    host: string;

    @Column({ nullable: true })
    port: number;

    @Column({ nullable: true })
    client_ip: string;

    @Column({ nullable: true })
    user_agent: string;

    @Column({ nullable: true })
    referer: string;
}