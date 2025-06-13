import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { MulterModule } from '@nestjs/platform-express';
import { CacheModule } from '@nestjs/cache-manager';
import { DocumentModule } from './document/document.module';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
