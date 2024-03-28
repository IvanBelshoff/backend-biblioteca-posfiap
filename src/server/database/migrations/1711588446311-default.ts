import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711588446311 implements MigrationInterface {
    name = 'Default1711588446311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dashboards" ("id" BIGSERIAL NOT NULL, "titulo" text NOT NULL, "autor" text NOT NULL, "isbn" text NOT NULL, "ano_publicacao" date NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b3d7067b12003b33436b9ab9f94" UNIQUE ("isbn"), CONSTRAINT "PK_1b4b4bc346118e0d335f16c5344" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dashboards"`);
    }

}
