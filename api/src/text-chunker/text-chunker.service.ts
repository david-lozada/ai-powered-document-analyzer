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
    const pageMap = new Map<number, string>();

    const render_page = async (pageData: any) => {
      // Parse text from the page
      const render_options = {
        // Replaces all occurrences of whitespace with standard spaces (0x20).
        normalizeWhitespace: true,
        // do not attempt to combine same line TextItem's.
        disableCombineTextItems: false,
      };

      const textContent = await pageData.getTextContent(render_options);

      let lastY,
        text = '';
      for (const item of textContent.items) {
        if (!lastY || item.transform[5] === lastY) {
          text += ' ' + item.str;
        } else {
          text += '\n' + item.str;
        }
        lastY = item.transform[5];
      }

      // Store per page (pageIndex is 0-based)
      pageMap.set(pageData.pageIndex + 1, text);

      return text;
    };

    const options = {
      pagerender: render_page,
    };

    await pdfParse(pdfBuffer, options);

    // Convert map to chunks, sorting by page number
    const sortedPages = Array.from(pageMap.keys()).sort((a, b) => a - b);
    for (const page of sortedPages) {
      const text = pageMap.get(page) || '';
      chunks.push(...this.splitIntoSemanticChunks(text, page));
    }

    return chunks;
  }

  private extractTextFileChunks(
    text: string,
  ): { text: string; page: number }[] {
    return this.splitIntoSemanticChunks(text, 1);
  }

  private cleanText(text: string): string {
    // 1. Unite separated single letters "H e l l o" -> "Hello"
    // Heuristic: sequence of single letters separated by spaces.
    let cleaned = text
      .replace(/(?:\s|^)([a-zA-Z])(?=\s[a-zA-Z](?:\s|$))/g, '$1')
      .replace(/([a-zA-Z])\s([a-zA-Z])(?=\s)/g, '$1$2'); // merging pass

    // 2. Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  }

  private splitIntoSemanticChunks(
    text: string,
    page: number,
    chunkSize = 1000,
  ): { text: string; page: number }[] {
    // Clean text first
    const cleanedText = this.cleanText(text);

    // Split by sentence delimiters (keep delimiter).
    // This is a simple regex for sentence splitting.
    const sentences = cleanedText.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [
      cleanedText,
    ];

    const chunks: { text: string; page: number }[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (
        currentChunk.length + sentence.length > chunkSize &&
        currentChunk.length > 0
      ) {
        chunks.push({ text: currentChunk.trim(), page });
        currentChunk = '';
      }
      currentChunk += sentence;
    }

    if (currentChunk.trim()) {
      chunks.push({ text: currentChunk.trim(), page });
    }

    return chunks;
  }
}
