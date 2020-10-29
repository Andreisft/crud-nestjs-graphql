import {MigrationInterface, QueryRunner} from "typeorm";

export class firstBlood1603998401255 implements MigrationInterface {
    name = 'firstBlood1603998401255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pokemon_types" ("id" SERIAL NOT NULL, "slot" integer NOT NULL, "type" jsonb NOT NULL, CONSTRAINT "PK_4d2d359062d5345ac2aa14bd702" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pokemons" ("id" integer NOT NULL, "name" character varying NOT NULL, "weight" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3172290413af616d9cfa1fdc9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coaches" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_0b999283a8c4c9eada0cdf89e27" UNIQUE ("username"), CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pokemons_types_pokemon_types" ("pokemonsId" integer NOT NULL, "pokemonTypesId" integer NOT NULL, CONSTRAINT "PK_bfacaee4e93f7bad6c914137f62" PRIMARY KEY ("pokemonsId", "pokemonTypesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0f3487a914e772b67763d97ba" ON "pokemons_types_pokemon_types" ("pokemonsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8cce56d748e07f4c01bf9272a4" ON "pokemons_types_pokemon_types" ("pokemonTypesId") `);
        await queryRunner.query(`CREATE TABLE "coaches_pokemons_pokemons" ("coachesId" integer NOT NULL, "pokemonsId" integer NOT NULL, CONSTRAINT "PK_59bbe09388cf4f9ef1895e974fc" PRIMARY KEY ("coachesId", "pokemonsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c97c018e8a879494f35c22ad66" ON "coaches_pokemons_pokemons" ("coachesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bb04cce0c597ae14c8207866b" ON "coaches_pokemons_pokemons" ("pokemonsId") `);
        await queryRunner.query(`ALTER TABLE "pokemons_types_pokemon_types" ADD CONSTRAINT "FK_a0f3487a914e772b67763d97ba1" FOREIGN KEY ("pokemonsId") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pokemons_types_pokemon_types" ADD CONSTRAINT "FK_8cce56d748e07f4c01bf9272a43" FOREIGN KEY ("pokemonTypesId") REFERENCES "pokemon_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coaches_pokemons_pokemons" ADD CONSTRAINT "FK_c97c018e8a879494f35c22ad663" FOREIGN KEY ("coachesId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coaches_pokemons_pokemons" ADD CONSTRAINT "FK_3bb04cce0c597ae14c8207866bc" FOREIGN KEY ("pokemonsId") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coaches_pokemons_pokemons" DROP CONSTRAINT "FK_3bb04cce0c597ae14c8207866bc"`);
        await queryRunner.query(`ALTER TABLE "coaches_pokemons_pokemons" DROP CONSTRAINT "FK_c97c018e8a879494f35c22ad663"`);
        await queryRunner.query(`ALTER TABLE "pokemons_types_pokemon_types" DROP CONSTRAINT "FK_8cce56d748e07f4c01bf9272a43"`);
        await queryRunner.query(`ALTER TABLE "pokemons_types_pokemon_types" DROP CONSTRAINT "FK_a0f3487a914e772b67763d97ba1"`);
        await queryRunner.query(`DROP INDEX "IDX_3bb04cce0c597ae14c8207866b"`);
        await queryRunner.query(`DROP INDEX "IDX_c97c018e8a879494f35c22ad66"`);
        await queryRunner.query(`DROP TABLE "coaches_pokemons_pokemons"`);
        await queryRunner.query(`DROP INDEX "IDX_8cce56d748e07f4c01bf9272a4"`);
        await queryRunner.query(`DROP INDEX "IDX_a0f3487a914e772b67763d97ba"`);
        await queryRunner.query(`DROP TABLE "pokemons_types_pokemon_types"`);
        await queryRunner.query(`DROP TABLE "coaches"`);
        await queryRunner.query(`DROP TABLE "pokemons"`);
        await queryRunner.query(`DROP TABLE "pokemon_types"`);
    }

}
