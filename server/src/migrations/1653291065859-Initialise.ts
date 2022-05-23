import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialise1653291065859 implements MigrationInterface {
    name = 'Initialise1653291065859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote" ("userId" integer NOT NULL, "postCardId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_07a72c5d2c1a67a3394c539f4b5" PRIMARY KEY ("userId", "postCardId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "avatar" character varying(100) NOT NULL, "username" character varying(100) NOT NULL, "password" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_card" ("id" SERIAL NOT NULL, "image" character varying(100) NOT NULL, "content" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3a275be2bedb88184c743afedb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_bbe41a8499020f01f16b70fa817" FOREIGN KEY ("postCardId") REFERENCES "post_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_card" ADD CONSTRAINT "FK_b674ab1ed3d1bb1207322d3d2c9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_card" DROP CONSTRAINT "FK_b674ab1ed3d1bb1207322d3d2c9"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_bbe41a8499020f01f16b70fa817"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`DROP TABLE "post_card"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }

}
