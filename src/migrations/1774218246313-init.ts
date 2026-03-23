import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774218246313 implements MigrationInterface {
    name = 'Init1774218246313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
    }

}
