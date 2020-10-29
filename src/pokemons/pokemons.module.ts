import { Module, HttpModule } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";
import { PokemonsResolver } from "./pokemons.resolver";
import { CommonModule } from "../common/common.module";
import { PokemonTypesService } from "./pokemon-types.ts/pokemon-types.service";

@Module({
  imports: [CommonModule, HttpModule],
  providers: [PokemonsService, PokemonsResolver, PokemonTypesService],
  exports: [PokemonsService],
})
export class PokemonsModule {}
