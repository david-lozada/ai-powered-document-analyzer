import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SearchDocumentDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsNumber()
  @IsNotEmpty()
  documentId?: number;
}
