import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711588676042 implements MigrationInterface {
    name = 'Default1711588676042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "livros" ("id" BIGSERIAL NOT NULL, "titulo" text NOT NULL, "autor" text NOT NULL, "isbn" text NOT NULL, "ano_publicacao" date NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_af619d4f3297f10337117d0738f" UNIQUE ("isbn"), CONSTRAINT "PK_69daba516e6b0dd45f49c4d8d52" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "livros"`);
    }

}
