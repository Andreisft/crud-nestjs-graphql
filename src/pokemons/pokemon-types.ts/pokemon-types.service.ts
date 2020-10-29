import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { PokemonType } from "./pokemon-type.entity";

@Injectable()
export class PokemonTypesService {
  constructor(private readonly connection: Connection) {}

  async findByName(name: string) {
    return this.connection
      .getRepository(PokemonType)
      .createQueryBuilder("pokemonType")
      .where("pokemonType.type ::jsonb @> :type", { type: {
        name
      } })
      .getOne();
  }

  async findByPokemonId(pokemonId: number) {
    return this.connection
      .getRepository(PokemonType)
      .createQueryBuilder("pokemonType")
      .leftJoin("pokemonType.pokemons", "pokemons")
      .where("pokemons.id = :pokemonId", { pokemonId })
      .getMany();
  }
}
