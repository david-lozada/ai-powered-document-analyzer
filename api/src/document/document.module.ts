import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  imports: [],
  controllers: [DocumentController],
  providers: [DocumentService, GeminiService, TextExtractionService],
})
export class DocumentModule {}
