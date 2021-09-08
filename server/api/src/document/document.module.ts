import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRightModule } from 'src/access-right/access-right.module';
import { UserModule } from 'src/user/user.module';
import { DocumentStorageService } from './document-storage.service';
import { DocumentController } from './document.controller';
import { Document } from './document.entity';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), ConfigModule, AccessRightModule, UserModule],
  providers: [DocumentService, DocumentStorageService],
  controllers: [DocumentController]
})
export class DocumentModule {}
