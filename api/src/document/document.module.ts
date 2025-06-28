import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';
import { documentProviders } from './document.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    GeminiService,
    TextExtractionService,
    ...documentProviders,
  ],
})
export class DocumentModule {}
