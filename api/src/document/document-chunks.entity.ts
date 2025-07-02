import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DocumentChunks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('simple-array') // Use 'simple-array' if pgvector is not available
  embedding: number[];

  @Column('integer')
  page_number: number;
}
