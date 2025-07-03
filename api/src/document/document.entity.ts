// document.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DocumentChunks } from './document-chunks.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  filename: string;

  @Column()
  original_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @OneToMany(() => DocumentChunks, (chunk) => chunk.document)
  chunks: Awaited<DocumentChunks>[];
}
