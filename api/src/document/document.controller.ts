import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';
import { DocumentDto } from './document.dto';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly textExtractionService: TextExtractionService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Endpoint to analyze a document.
   * It uses Tesseract to recognize text from the uploaded file and OpenAI to summarize it.
   * @param file The uploaded file containing the document.
   * @param dto
   * @returns The recognized text and the summary response from OpenAI.
   */
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: DocumentDto,
  ) {
    try {
      const text = await this.textExtractionService.extractText(file.path);
      const query = `${dto.description}: ${text}`;
      console.log('Description: ' + query);
      // const response = await this.geminiService.query(query);
      return query;
    } catch (err) {
      console.error('Error analyzing document:', err);
      throw new Error('Failed to analyze document');
    }
  }
}
