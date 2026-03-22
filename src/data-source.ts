import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Product } from './product/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
