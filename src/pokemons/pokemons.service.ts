import {
  Injectable,
  HttpService,
  HttpException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Connection, createQueryBuilder, InsertResult } from "typeorm";
import { CommonService } from "../common/common.service";

import { CreatePokemonInput, Pokemon as PokemonGraphql } from "../graphql";
import { ConfigService } from "@nestjs/config";
import { Pokemon } from "../pokemons/pokemon.entity";
import { Coach } from "../coaches/coach.entity";
import { PokemonType } from "./pokemon-types.ts/pokemon-type.entity";
import { type } from "os";
import { PokemonTypesService } from "./pokemon-types.ts/pokemon-types.service";

@Injectable()
export class PokemonsService {
  private POKEMON_API_URL = this.configService.get<string>("POKEMON_API_URL");

  constructor(
    private readonly connection: Connection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly pokemonTypesService: PokemonTypesService
  ) {}

  async create(createPokemonInput: CreatePokemonInput, currentCoach?: Coach) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { name: pokemonName } = createPokemonInput;
      const coachId = currentCoach.id;

      if (!pokemonName)
        throw new BadRequestException("it is necessary to put a name");

      const {
        data: { weight, types, name, id },
      } = await this.httpService
        .get<PokemonGraphql>(`${this.POKEMON_API_URL}/${pokemonName}`)
        .toPromise();

      const pokemonResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Pokemon)
        .values({
          id,
          weight,
          name,
        })
        .execute();

      const pokemon = await queryRunner.manager
        .getRepository(Pokemon)
        .createQueryBuilder("pokemon")
        .where("pokemon.id = :id", { id: pokemonResult.identifiers[0].id })
        .getOne();

      if (currentCoach)
        await queryRunner.manager
          .createQueryBuilder()
          .relation(Pokemon, "coaches")
          .of(pokemon.id)
          .add(coachId);

      let pokemonTypes: number[] = [];

      await Promise.all(
        types.map(async (pokemonType) => {
          const exists = await this.pokemonTypesService.findByName(
            pokemonType.type.name
          );

          if (!exists) {
            const pokemonTypeResult = await queryRunner.manager
              .createQueryBuilder()
              .insert()
              .into(PokemonType)
              .values(pokemonType)
              .execute();

            pokemonTypes.push(pokemonTypeResult.identifiers[0].id);
          }
        })
      );

      await queryRunner.manager
        .createQueryBuilder()
        .relation(Pokemon, "types")
        .of(pokemon.id)
        .add(pokemonTypes);

      await queryRunner.commitTransaction();

      return pokemon;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if ((err.response && err.response.status) || err.status)
        throw new HttpException(
          err.message ||
            "An error occurred while trying to register the pokemon",
          err.response.status || err.status
        );

      throw new InternalServerErrorException(
        "An error occurred while trying to register the pokemon"
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByCoach(id: number, currentCoach: Coach) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const coachId = currentCoach.id;
      const pokemon = await this.findOne(id, coachId);

      if (!pokemon)
        throw new BadRequestException(
          "It was not possible to find an pokemon with this information"
        );

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Pokemon)
        .where("id = :id", { id })
        .andWhere("coach.id = :coachId", { coachId })
        .execute();

      await queryRunner.commitTransaction();

      return pokemon;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof HttpException) throw err;

      throw new BadRequestException("An error occurred while trying to remove");
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number, coachId: number) {
    return this.connection
      .getRepository(Pokemon)
      .createQueryBuilder("pokemon")
      .leftJoin("pokemon.coach", "coach")
      .where("pokemon.id = :id", { id })
      .andWhere("coach.id = :coachId", { coachId })
      .getOne();
  }

  async findByCoachId(coachId: number) {
    return this.connection
      .getRepository(Pokemon)
      .createQueryBuilder("pokemon")
      .leftJoin("pokemon.coaches", "coach")
      .where("coach.id = :coachId", { coachId })
      .getMany();
  }
}
