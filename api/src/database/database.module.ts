// database/database.module.ts
import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => {
        return dataSource;
      },
      inject: [DataSource],
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}