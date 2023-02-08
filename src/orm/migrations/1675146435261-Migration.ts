import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1675146435261 implements MigrationInterface {
  name = 'Migration1675146435261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "actorId" integer NOT NULL, "authorizedPartyId" character varying NOT NULL, "checksum" character varying NOT NULL, "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_19354ed146424a728c1112a8cbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "actorId_idx" ON "auth_session" ("actorId") `);
    await queryRunner.query(`CREATE INDEX "authorizedPartyId_idx" ON "auth_session" ("authorizedPartyId") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "checksum_uidx" ON "auth_session" ("checksum") `);
    await queryRunner.query(
      `CREATE TABLE "auth_challenge" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "target" character varying NOT NULL, "memo" character varying NOT NULL, "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL, "isResolved" boolean NOT NULL, "durationDelta" integer NOT NULL, CONSTRAINT "PK_afd9a8cbeb610e138f30e769eb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "target_createdAt_idx" ON "auth_challenge" ("target", "createdAt") `);
    await queryRunner.query(
      `CREATE TABLE "identity_method" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, "provider" character varying NOT NULL, "Identity" character varying NOT NULL, CONSTRAINT "PK_bbfb5a875652d1cead5b065046f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying, "emailVerified" boolean, "birthday" TIMESTAMP, "displayName" character varying, "avatar" character varying, "roles" character varying array NOT NULL, "groups" character varying array, "telegram" character varying, "twitter" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "identity_method"`);
    await queryRunner.query(`DROP INDEX "public"."target_createdAt_idx"`);
    await queryRunner.query(`DROP TABLE "auth_challenge"`);
    await queryRunner.query(`DROP INDEX "public"."checksum_uidx"`);
    await queryRunner.query(`DROP INDEX "public"."authorizedPartyId_idx"`);
    await queryRunner.query(`DROP INDEX "public"."actorId_idx"`);
    await queryRunner.query(`DROP TABLE "auth_session"`);
  }
}
