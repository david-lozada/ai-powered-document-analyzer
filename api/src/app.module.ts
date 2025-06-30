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
import { TextExtractionModule } from './text-extraction/text-extraction.module';
import { SupabaseService } from './supabase/supabase.service';
// import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-us-east-2.pooler.supabase.com',
      port: 6543,
      username: 'postgres.fqplprbnavdtnicyeiie',
      password: 'Salma*0206', // Plain string (no URL encoding needed here)
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Auto-load entities
      ssl: true,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000,
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
    TextExtractionModule,
  ],
  controllers: [],
  providers: [SupabaseService],
})
export class AppModule {}
