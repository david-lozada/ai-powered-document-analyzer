import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextExtractionService } from './textExtraction/textExtraction.service';
import { GeminiService } from './gemini/gemini.service';
import { GeminiModule } from './gemini/gemini.module';
import { DocumentController } from './document/document.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    GeminiModule,
  ],
  controllers: [DocumentController],
  providers: [TextExtractionService, GeminiService],
})
export class AppModule {}
