import { Test, TestingModule } from '@nestjs/testing';
import { Document } from './document.providers';

describe('Document', () => {
  let provider: Document;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Document],
    }).compile();

    provider = module.get<Document>(Document);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
