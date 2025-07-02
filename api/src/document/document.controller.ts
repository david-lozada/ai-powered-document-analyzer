import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { DocumentDto } from './document.dto';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  /**
   * Endpoint to analyze a document.
   * It uses Tesseract to recognize text from the uploaded file and Gemini to summarize it.
   * @param file The uploaded file containing the document.
   * @returns The recognized text and the summary response from Gemini.
   */
  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  analyzeDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed. Please ensure a file is provided.');
    }
    // Additional validation
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF files are allowed.');
    }
    console.log('Passed');
    return this.documentService.processDocument(file);
  }
}
