import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { Coach } from "../coaches/coach.entity";
import { PokemonType } from "./pokemon-types.ts/pokemon-type.entity";

@Entity("pokemons")
export class Pokemon {
  @PrimaryColumn({ nullable: false })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  weight: number;

  @ManyToMany(
    () => Coach,
    (coach) => coach.pokemons
  )
  coaches: Coach;

  @ManyToMany(
    () => PokemonType,
    (pokemonType) => pokemonType.pokemons
  )
  @JoinTable()
  types: PokemonType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
