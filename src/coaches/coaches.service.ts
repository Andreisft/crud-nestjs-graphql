import { Injectable, BadRequestException, HttpException } from '@nestjs/common';

import { Coach } from './coach.entity';
import { Connection } from 'typeorm';
import { CommonService } from '../common/common.service';
import { CreateCoachInput, UpdateCoachInput } from '../graphql';
import { hashSync } from 'bcryptjs';
import { removeUndefinedFromObject } from 'src/common/utils/remove-undefined-from-object';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoachesService {
  private SECRET_KEY = this.configService.get<string>('SECRET_KEY');

  constructor(
    private readonly connection: Connection,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  async login(username: string, password: string) {
    try {
      const coach = await this.findByUsername(username);

      if (!coach) throw new BadRequestException('Nonexistent user');

      const equalsPassword = compareSync(password, coach.password);

      if (!equalsPassword) throw new BadRequestException('Incorrect password');

      const token = sign({ id: coach.id }, this.SECRET_KEY);

      return { token, coach };
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new BadRequestException(
        'An error occurred while trying to sign in',
      );
    }
  }

  async create(createCoachInput: CreateCoachInput) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { password, username } = createCoachInput;

      const exists = await this.findByUsername(username);

      if (exists) throw new BadRequestException('This username already exists');

      const result = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Coach)
        .values({ username, password: hashSync(password) })
        .execute();

      await queryRunner.commitTransaction();

      return this.commonService.findById(result.identifiers[0].id, Coach);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof HttpException) throw err;

      throw new BadRequestException(
        'An error occurred while trying to register the coach',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateCoachInput: UpdateCoachInput) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { id, username, password } = updateCoachInput;

      let exists = await this.commonService.findById(id, Coach);

      if (!exists) throw new BadRequestException('Nonexistent user');

      exists = await this.findByUsername(username);

      if (exists && exists.id !== id)
        throw new BadRequestException('This username already exists');

      const updateCoach = {
        username: username || undefined,
        password: password ? hashSync(password) : undefined,
      };

      const normalize = removeUndefinedFromObject(updateCoach);

      if (Object.keys(normalize).length === 0)
        throw new BadRequestException('No modifications were made');

      await queryRunner.manager
        .createQueryBuilder()
        .update(Coach)
        .set({ ...normalize })
        .where('id = :id', { id })
        .execute();

      await queryRunner.commitTransaction();

      return this.commonService.findById(id, Coach);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof HttpException) throw err;

      throw new BadRequestException(
        'An error occurred while trying to update the coach',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByUsername(username: string) {
    return this.connection
      .getRepository(Coach)
      .createQueryBuilder('coach')
      .where('coach.username = :username', { username })
      .getOne();
  }
}
