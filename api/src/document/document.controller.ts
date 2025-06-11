import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TextExtractionService } from '../textExtraction/textExtraction.service';
import { GeminiService } from '../gemini/gemini.service';

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
   * @returns The recognized text and the summary response from OpenAI.
   */
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(@UploadedFile() file: Express.Multer.File) {
    try {
      const text = await this.textExtractionService.extractText(file.path);
      // console.log(text);
      const query = `Show me the most relevant information from the following text: ${text}`;
      const response = await this.geminiService.query(query);
      return { text, response };
    } catch (err) {
      console.error('Error analyzing document:', err);
      throw new Error('Failed to analyze document');
    }
  }
}
