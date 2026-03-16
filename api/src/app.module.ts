import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { DocumentModule } from './document/document.module';
import { diskStorage } from 'multer';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { TextChunkerModule } from './text-chunker/text-chunker.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || undefined,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, // Plain string (no URL encoding needed here)
      database: process.env.DB_NAME || 'postgres',
      autoLoadEntities: true,
      ssl: process.env.DB_SSL === 'true',
      extra:
        process.env.DB_SSL === 'true'
          ? {
              ssl: { rejectUnauthorized: false },
            }
          : {},
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600 * 1000, // 1 hour in ms
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads'), // Absolute path
        filename: (req, file, cb) => {
          const uniqueName = file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
    GeminiModule,
    DocumentModule,
    DatabaseModule,
    TextChunkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
