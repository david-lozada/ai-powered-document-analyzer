import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { DocumentDto } from './document.dto';
import { DocumentService } from './document.service';
import { SearchDocumentDto } from './search-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  /**
   * Endpoint to process a document.
   * It calls processDocument method.
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
    return this.documentService.processDocument(file);
  }

  @Post('/:documentId/search') //TODO: omit cache when new param is given
  async searchDocuments(
    @Body() bodyDto: SearchDocumentDto,
    @Param('documentId') documentId: number,
  ) {
    const searchDto = { ...bodyDto, documentId };
    if (!searchDto.query || !searchDto.documentId) {
      throw new BadRequestException('Search query and document are required');
    }
    return this.documentService.semanticSearch(
      searchDto.query,
      searchDto.documentId,
    );
  }

  @Post('/:documentId/analyze') //TODO: omit cache when new param is given
  async analyzeDocuments(
    @Body() bodyDto: SearchDocumentDto,
    @Param('documentId') documentId: number,
  ) {
    const searchDto = { ...bodyDto, documentId };
    if (!searchDto.query || !searchDto.documentId) {
      throw new BadRequestException('Search query and document are required');
    }
    return this.documentService.analyzeAllChunks(
      searchDto.query,
      searchDto.documentId,
    );
  }

  @Get('documents/:skip/:take')
  async getAllDocuments(
    @Param('skip') skip: number,
    @Param('take') take: number,
  ) {
    return this.documentService.getAllDocuments(skip, take);
  }
  @Get('/:documentId')
  async getDocumentById(@Param('documentId') documentId: number) {
    if (!documentId) {
      throw new BadRequestException('Document ID is required');
    }
    return this.documentService.getDocumentById(documentId);
  }
}
