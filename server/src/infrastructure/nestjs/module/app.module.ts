import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';
import { AuthModule } from './auth.module';
import { CustomersController } from '../../../controllers/customers.controller';
import { MembersController } from '../../../controllers/members.controller';
import { RefundsController } from '../../../controllers/refunds.controller';
import { ReportsController } from '../../../controllers/reports.controller';
import { DashboardController } from '../../../controllers/dashboard.controller';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/../../../entity/**/*.entity.{ts,js}'],
        synchronize: true,
      }),
    }),
  ],
  controllers: [
    CustomersController,
    MembersController,
    RefundsController,
    ReportsController,
    DashboardController,
  ],
  providers: [],
})
export class AppModule {}
