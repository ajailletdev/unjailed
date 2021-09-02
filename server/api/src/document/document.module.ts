import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentStorageService } from './document-storage.service';
import { DocumentController } from './document.controller';
import { Document } from './document.entity';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), ConfigModule],
  providers: [DocumentService, DocumentStorageService],
  controllers: [DocumentController]
})
export class DocumentModule {}
