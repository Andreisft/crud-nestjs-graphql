import { Injectable, BadRequestException, HttpException } from "@nestjs/common";
import { Connection, EntityTarget } from "typeorm";

import { Coach } from "../coaches/coach.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Pokemon } from "../pokemons/pokemon.entity";
import { EMLINK } from "constants";

@Injectable()
export class CommonService {
  constructor(private readonly connection: Connection) {}

  async findAll<T extends Coach | Pokemon, K extends EntityTarget<T>>(
    entity: K
  ) {
    return this.connection
      .getRepository(entity)
      .createQueryBuilder()
      .getMany();
  }

  async findById<T extends Coach | Pokemon, K extends EntityTarget<T>>(
    id: number,
    entity: K
  ) {
    return this.connection
      .getRepository(entity)
      .createQueryBuilder("element")
      .where("element.id = :id", { id })
      .getOne();
  }

  async delete<T extends Coach | Pokemon, K extends EntityTarget<T>>(
    id: number,
    entity: K
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const element = await this.findById(id, Coach);

      if (!element)
        throw new BadRequestException(
          "It was not possible to find an entity with this information"
        );

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(entity)
        .where("id = :id", { id })
        .execute();

      await queryRunner.commitTransaction();

      return element;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof HttpException) throw err;

      throw new BadRequestException("An error occurred while trying to remove");
    } finally {
      await queryRunner.release();
    }
  }
}
