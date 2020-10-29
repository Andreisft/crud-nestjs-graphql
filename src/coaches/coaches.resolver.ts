import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from "@nestjs/graphql";

import { CoachesService } from "./coaches.service";
import {
  CreateCoachInput,
  UpdateCoachInput,
  CreatePokemonInput,
} from "../graphql";
import { CommonService } from "../common/common.service";
import { Coach } from "./coach.entity";
import { CurrentCoach } from "src/common/decorators/current-user.decorator";
import { Auth } from "../common/decorators/auth.decorator";
import { PokemonsService } from "../pokemons/pokemons.service";

@Resolver("Coach")
export class CoachesResolver {
  constructor(
    private readonly coachesService: CoachesService,
    private readonly commonService: CommonService,
    private readonly pokemonsService: PokemonsService
  ) {}

  @Mutation()
  async login(
    @Args("username") username: string,
    @Args("password") password: string
  ) {
    return this.coachesService.login(username, password);
  }

  @Mutation()
  async createCoach(
    @Args("createCoachInput") createCoachInput: CreateCoachInput
  ) {
    return this.coachesService.create(createCoachInput);
  }

  @Auth()
  @Mutation()
  async deletePokemonCoach(
    @Args("pokemonId") pokemonId: number,
    @CurrentCoach() currentCoach: Coach
  ) {
    return this.pokemonsService.deleteByCoach(pokemonId, currentCoach);
  }

  @Auth()
  @Mutation()
  async createPokemonCoach(
    @Args("createPokemonInput") createPokemonInput: CreatePokemonInput,
    @CurrentCoach() currentCoach: Coach
  ) {
    return this.pokemonsService.create(createPokemonInput, currentCoach);
  }

  @Auth()
  @Mutation()
  async updateCoach(
    @Args("updateCoachInput") updateCoachInput: UpdateCoachInput,
    @CurrentCoach() currentCoach: Coach
  ) {
    return this.coachesService.update(updateCoachInput);
  }

  @Auth()
  @Mutation()
  async deleteCoach(@Args("id") id: number) {
    return this.commonService.delete(id, Coach);
  }

  @Auth()
  @Query()
  async coaches() {
    return this.commonService.findAll(Coach);
  }

  @Auth()
  @Query()
  async coach(@Args("id") id: number) {
    return this.commonService.findById(id, Coach);
  }

  @Auth()
  @Query()
  async currentCoach(@CurrentCoach() currentCoach: Coach) {
    return currentCoach;
  }

  @ResolveField()
  async pokemons(@Parent() coach: Coach) {
    return this.pokemonsService.findByCoachId(coach.id);
  }
}
