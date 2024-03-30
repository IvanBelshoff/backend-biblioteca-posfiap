import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711806220626 implements MigrationInterface {
    name = 'Default1711806220626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" BIGSERIAL NOT NULL, "acao" character varying NOT NULL, "status" integer, "data" TIMESTAMP NOT NULL DEFAULT now(), "url_requisicao" character varying NOT NULL, "response" character varying, "body" json, "query" json, "params" json, "tempo_de_resposta" integer, "metodo" character varying, "level" character varying NOT NULL, "host" character varying, "port" integer, "client_ip" character varying, "user_agent" character varying, "referer" character varying, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
