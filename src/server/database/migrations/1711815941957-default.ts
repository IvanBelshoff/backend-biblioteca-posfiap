import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711815941957 implements MigrationInterface {
    name = 'Default1711815941957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "editoras" ("id" BIGSERIAL NOT NULL, "nome" text NOT NULL, "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9974cc858c97fb880c59f85e183" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "livros" ADD "editora_id" bigint`);
        await queryRunner.query(`ALTER TABLE "livros" ADD CONSTRAINT "FK_c20aee57e1cd35613512abb9fcc" FOREIGN KEY ("editora_id") REFERENCES "editoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "livros" DROP CONSTRAINT "FK_c20aee57e1cd35613512abb9fcc"`);
        await queryRunner.query(`ALTER TABLE "livros" DROP COLUMN "editora_id"`);
        await queryRunner.query(`DROP TABLE "editoras"`);
    }

}
