// document.module.ts
import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { GeminiService } from '../gemini/gemini.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentChunks } from './document-chunks.entity';
import { TextChunkerModule } from '../text-chunker/text-chunker.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Document, DocumentChunks]),
    TextChunkerModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService, GeminiService],
})
export class DocumentModule {}
