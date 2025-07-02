// src/text-chunker/text-chunker.module.ts
import { Module } from '@nestjs/common';
import { TextChunker } from './text-chunker.service';

@Module({
  providers: [TextChunker],
  exports: [TextChunker], // Make it available for DI
})
export class TextChunkerModule {}