import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStorageService } from './document-storage.service';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
        private documentStorageService: DocumentStorageService,
    ) { }

    public async bulkAddFiles(docs: Express.Multer.File[]): Promise<Document[]> {
        const documents = [];
        await Promise.all(docs.map(async (doc) => {
            documents.push(await this.addOne(doc));
        }));
        return documents;
    }

    public async addOne(doc: Express.Multer.File): Promise<Document> {
        const document = new Document({
            originalName: doc.originalname,
            mime: doc.mimetype,
            size: doc.size
        });
        try {
            const addedDoc = await this.documentsRepository.save(document);
            await this.documentStorageService.putFile(addedDoc.id!, doc.buffer);
            return addedDoc;
        }
        catch (_) {
            throw _;
        }
    }

    public async editFilename(id: string, name: string): Promise<Document> {
        try {
            const doc = await this.documentsRepository.findOne(id);
            doc.originalName = name;
            return await this.documentsRepository.save(doc);
        }
        catch(_) {
            throw _;
        }
    }

    public async deleteADocument(id: string): Promise<Document> {
        try {
            const doc = await this.documentsRepository.findOne(id);
            await this.documentStorageService.removeFile(doc.id);
            return await this.documentsRepository.remove(doc);
        }
        catch(_) {
            throw _;
        }
    }

    public async findAll(): Promise<Document[]> {
        return await this.documentsRepository.find({ order: { createdAt: 'DESC' }});
    }

    public async findOne(id: string): Promise<Document> {
        return await this.documentsRepository.findOne(id);
    }

    public async remove(id: string): Promise<void> {
        await this.documentsRepository.delete(id);
    }
}
