import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column('text')
  content: string;

  @Column('simple-array') // Use 'simple-array' if pgvector is not available
  embedding: number[];
}
