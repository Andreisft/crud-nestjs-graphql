import { Module } from "@nestjs/common";
import { CoachesService } from "./coaches.service";
import { CoachesResolver } from "./coaches.resolver";
import { CommonModule } from "../common/common.module";
import { PokemonsModule } from "../pokemons/pokemons.module";

@Module({
  imports: [CommonModule, PokemonsModule],
  providers: [CoachesService, CoachesResolver],
})
export class CoachesModule {}
