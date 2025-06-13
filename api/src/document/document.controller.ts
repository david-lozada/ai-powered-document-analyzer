import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentDto } from './document.dto';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  /**
   * Endpoint to analyze a document.
   * It uses Tesseract to recognize text from the uploaded file and Gemini to summarize it.
   * @param file The uploaded file containing the document.
   * @param dto
   * @returns The recognized text and the summary response from Gemini.
   */
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  analyzeDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: DocumentDto,
  ) {
    if (!file) {
      throw new Error('File upload failed. Please ensure a file is provided.');
    }
    console.log('Multer file object:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path, // Check if this is populated
      buffer: file.buffer, // Check if file is in memory
    });
    // Additional validation
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF files are allowed.');
    }
    return this.documentService.analyzeDocument(file, dto);
  }

  @Post('test-upload')
  @UseInterceptors(FileInterceptor('file'))
  testUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    return { message: 'File uploaded successfully', file };
  }
}
