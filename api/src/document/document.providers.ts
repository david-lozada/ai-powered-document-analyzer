import { DataSource } from 'typeorm';
import { DocumentChunks } from './document-chunks.entity';

export const documentProviders = [
  {
    provide: 'DOCUMENT_CHUNKS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DocumentChunks),
    inject: ['DATA_SOURCE'],
  },
];
