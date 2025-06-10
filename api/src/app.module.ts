import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { CacheModule } from './cache/cache.module';
import { TextExtractionService } from './textExtraction/textExtraction.service';
import { OpenaiService } from './openai/openai.service';
import { DocumentController } from './document/document.controller';
import { MulterModule } from '@nestjs/platform-express';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    OpenaiModule
  ],
  controllers: [DocumentController],
  providers: [TextExtractionService, OpenaiService],
})
export class AppModule {}
