import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';
import { CommonModule } from './common/common.module';
import { CoachesModule } from './coaches/coaches.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import * as ormconfig from './ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV || 'development'}.env`,
    }),
    GraphQLModule.forRoot({
      playground: true,
      introspection: true,
      typePaths: ['./src/**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
        emitTypenameField: true,
      },
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(ormconfig),
    CommonModule,
    CoachesModule,
    PokemonsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
