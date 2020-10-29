import { ManyToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Pokemon } from "../pokemon.entity";
import { NamedApiResource } from "../../graphql";

@Entity("pokemon_types")
export class PokemonType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slot: number;

  @Column({ type: "jsonb", nullable: false })
  type: NamedApiResource;

  @ManyToMany(
    () => Pokemon,
    (pokemon) => pokemon.types
  )
  pokemons: Pokemon[];
}
