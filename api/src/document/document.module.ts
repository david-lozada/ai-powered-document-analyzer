import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { GeminiService } from '../gemini/gemini.service';
import { documentProviders } from './document.providers';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { TextExtractionModule } from '../text-extraction/text-extraction.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Document]),
    TextExtractionModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService, GeminiService, ...documentProviders],
})
export class DocumentModule {}
