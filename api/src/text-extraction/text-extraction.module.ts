import { Module } from '@nestjs/common';
import { TextExtractionService } from './text-extraction.service';
import { TEXT_EXTRACTION_SERVICE } from './text-extraction.constants';

@Module({
  providers: [
    {
      provide: TEXT_EXTRACTION_SERVICE,
      useClass: TextExtractionService,
    },
  ],
  exports: [TEXT_EXTRACTION_SERVICE],
})
export class TextExtractionModule {}
