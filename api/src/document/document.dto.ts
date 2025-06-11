import { IsNotEmpty, IsString } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
