// src/utils/text-chunker.util.ts

import { PDFDocument } from 'pdf-lib';
// import pdfParse from 'pdf-parse';
import { WordTokenizer } from 'natural';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TextChunker {
  private wordTokenizer = new WordTokenizer();

  async extractTextChunks(
    file: Express.Multer.File,
  ): Promise<{ text: string; page: number }[]> {
    if (file.mimetype === 'application/pdf') {
      return this.extractPdfChunks(file.buffer || fs.readFileSync(file.path));
    } else {
      return this.extractTextFileChunks(file.buffer.toString());
    }
  }

  private async extractPdfChunks(
    pdfBuffer: Buffer,
  ): Promise<{ text: string; page: number }[]> {
    const chunks: { text: string; page: number }[] = [];
    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {
      const subDocument = await PDFDocument.create();
      const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
      subDocument.addPage(copiedPage);
      const pdfBytes = await subDocument.save();
      const { text } = await pdfParse(Buffer.from(pdfBytes));

      chunks.push(...this.splitIntoSemanticChunks(text, i + 1));
    }

    return chunks;
  }

  private extractTextFileChunks(
    text: string,
  ): { text: string; page: number }[] {
    return this.splitIntoSemanticChunks(text, 1);
  }

  private splitIntoSemanticChunks(
    text: string,
    page: number,
    chunkSize = 1000,
  ): { text: string; page: number }[] {
    const sentences = this.wordTokenizer.tokenize(text);
    const chunks: { text: string; page: number }[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize) {
        chunks.push({ text: currentChunk.trim(), page });
        currentChunk = '';
      }
      currentChunk += `${sentence} `;
    }

    if (currentChunk.trim()) {
      chunks.push({ text: currentChunk.trim(), page });
    }

    return chunks;
  }
}
