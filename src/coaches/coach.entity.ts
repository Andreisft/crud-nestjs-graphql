import { Entity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { AbstractEntity } from "../common/abstracts/abstract.entity";
import { Pokemon } from "../pokemons/pokemon.entity";

@Entity("coaches")
export class Coach extends AbstractEntity {
  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @ManyToMany(
    () => Pokemon,
    (pokemon) => pokemon.coaches
  )
  @JoinTable()
  pokemons: Pokemon[];
}
