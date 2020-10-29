
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateCoachInput {
    username: string;
    password: string;
}

export class UpdateCoachInput {
    id: number;
    username?: string;
    password?: string;
}

export class CreatePokemonInput {
    name: string;
}

export class UpdatePokemonInput {
    coachId: number;
    name: string;
}

export class Coach {
    __typename?: 'Coach';
    id: string;
    username: string;
    pokemons?: Pokemon[];
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract coaches(): Coach[] | Promise<Coach[]>;

    abstract coach(): Coach | Promise<Coach>;

    abstract currentCoach(): Coach | Promise<Coach>;

    abstract pokemons(): Pokemon[] | Promise<Pokemon[]>;

    abstract pokemon(): Pokemon | Promise<Pokemon>;
}

export class LoginPayload {
    __typename?: 'LoginPayload';
    token: string;
    coach: Coach;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract login(username: string, password: string): LoginPayload | Promise<LoginPayload>;

    abstract createCoach(createCoachInput: CreateCoachInput): Coach | Promise<Coach>;

    abstract updateCoach(updateCoachInput: UpdateCoachInput): Coach | Promise<Coach>;

    abstract deleteCoach(id: number): Coach | Promise<Coach>;

    abstract deletePokemonCoach(pokemonId: number): Coach | Promise<Coach>;

    abstract createPokemonCoach(createPokemonInput: CreatePokemonInput): Coach | Promise<Coach>;

    abstract createPokemon(createPokemonInput?: CreatePokemonInput): Pokemon | Promise<Pokemon>;

    abstract deletePokemon(id: number): Pokemon | Promise<Pokemon>;
}

export class Pokemon {
    __typename?: 'Pokemon';
    id: number;
    name: string;
    weight: number;
    types: PokemonType[];
}

export class PokemonType {
    __typename?: 'PokemonType';
    slot: number;
    type: NamedApiResource;
}

export class NamedApiResource {
    __typename?: 'NamedApiResource';
    name: string;
    url: string;
}
