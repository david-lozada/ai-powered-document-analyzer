import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1707567600000 implements MigrationInterface {
  name = 'InitialSchema1707567600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    await queryRunner.query(
      `CREATE TABLE "document" ("id" SERIAL NOT NULL, "filename" character varying, "original_name" character varying NOT NULL, "description" character varying, "uploaded_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_e577deadf0302ca21977f00030d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_chunks" ("id" SERIAL NOT NULL, "content" text NOT NULL, "embedding" vector(768) NOT NULL, "page_number" integer NOT NULL, "document_id" integer, CONSTRAINT "PK_3de498522e8f19253457f920f86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_chunks" ADD CONSTRAINT "FK_document_chunks_document" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document_chunks" DROP CONSTRAINT "FK_document_chunks_document"`,
    );
    await queryRunner.query(`DROP TABLE "document_chunks"`);
    await queryRunner.query(`DROP TABLE "document"`);
  }
}
