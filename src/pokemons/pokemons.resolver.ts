import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from "@nestjs/graphql";

import { PokemonsService } from "./pokemons.service";
import { CreatePokemonInput } from "../graphql";
import { CommonService } from "../common/common.service";
import { Pokemon } from "./pokemon.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { Coach } from "../coaches/coach.entity";
import { PokemonTypesService } from "./pokemon-types.ts/pokemon-types.service";

@Resolver("Pokemon")
export class PokemonsResolver {
  constructor(
    private readonly pokemonsService: PokemonsService,
    private readonly pokemonTypesService: PokemonTypesService,
    private readonly commonService: CommonService
  ) {}

  @Auth()
  @Mutation()
  async createPokemon(
    @Args("createPokemonInput") createPokemonInput: CreatePokemonInput
  ) {
    return this.pokemonsService.create(createPokemonInput);
  }

  @Auth()
  @Mutation()
  async deletePokemon(@Args("id") id: number) {
    return this.commonService.delete(id, Pokemon);
  }

  @Auth()
  @Query()
  async pokemons() {
    return this.commonService.findAll(Pokemon);
  }

  @Auth()
  @Query()
  async pokemon(@Args("id") id: number) {
    return this.commonService.findById(id, Pokemon);
  }

  @ResolveField()
  async types(@Parent() coach: Coach) {
    return this.pokemonTypesService.findByPokemonId(coach.id);
  }
}
