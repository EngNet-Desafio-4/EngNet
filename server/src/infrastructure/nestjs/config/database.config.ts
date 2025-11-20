import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST ?? 'localhost',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'test_db',
}));
