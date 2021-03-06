import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStorageService } from './document-storage.service';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { AccessRightService } from 'src/access-right/access-right.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
        private documentStorageService: DocumentStorageService,
        private accessRightService: AccessRightService,
        private userService: UserService
    ) { }

    public async bulkAddFiles(docs: Express.Multer.File[], user: User ,folderId: string): Promise<Document[]> {
        const documents = [];
        await Promise.all(docs.map(async (doc) => {
            documents.push(await this.addOne(doc, user.id, folderId));
        }));
        return documents;
    }

    public async addOne(doc: Express.Multer.File, ownerId: string, folderId: string): Promise<Document> {
        const document = new Document({
            originalName: doc.originalname,
            mime: doc.mimetype,
            size: doc.size,
            folderId,
            ownerId
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

    public async removeMyAccessRight(id: string, userId: string): Promise<void>{
        try {
            await this.accessRightService.removeOne(id, userId);
        }
        catch(_) {
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
            const doc = await this.documentsRepository.findOne(id, { relations: ['viewers']});
            if (doc.viewers) {
                await Promise.all(doc.viewers.map(async (acc) => {
                    await this.accessRightService.removeOneById(acc.id);
                }));
            }
            const deleted = await this.documentsRepository.remove(doc);
            await this.documentStorageService.removeFile(doc.id);
            return deleted;
        }
        catch(_) {
            throw _;
        }
    }

    public async findAll(user: User, folderId: string): Promise<Document[]> {
        const docs = await this.documentsRepository.createQueryBuilder('doc')
            .where('doc.folderId = :folderId', { folderId })
            .andWhere('doc.ownerId = :ownerId', { ownerId: user.id })
            .orderBy('doc.originalName', 'ASC')
            .leftJoinAndSelect('doc.viewers', 'acc')
            .leftJoinAndSelect('acc.user', 'user')
            .getMany();
        return docs;
    }

    public async findAllSharedWithMe(userId: string): Promise<Document[]> {
        const docs = await this.documentsRepository.createQueryBuilder('doc')
            .leftJoinAndSelect('doc.viewers', 'acc')
            .leftJoinAndSelect('doc.owner', 'owner')
            .leftJoinAndSelect('acc.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany();

        return docs;
    }

    public async findOne(id: string): Promise<Document> {
        return await this.documentsRepository.createQueryBuilder('doc')
            .where('doc.id = :id', { id })
            .leftJoinAndSelect('doc.viewers', 'acc')
            .leftJoinAndSelect('acc.user', 'user')
            .getOne();
    }

    public async remove(id: string): Promise<void> {
        await this.documentsRepository.delete(id);
    }

    public async addAViewer (id: string, userId: string): Promise<Document> {
        try {
            const doc = await this.findOne(id);
            if (!doc) {
                throw new NotFoundException('Document not found');
            }
            
            await this.accessRightService.addOne({documentId: id, userId});

            return await this.findOne(id);
        }
        catch(_) {
            throw _;
        }
    }

    public async removeAViewer (id: string, userId: string): Promise<Document> {
        try {
            const doc = await this.findOne(id);
            if (!doc) {
                throw new NotFoundException('Document not found');
            }
            await this.accessRightService.removeOne(id, userId);

            return await this.findOne(id);
        }
        catch(_) {
            throw _;
        }
    }

    public async isGoodOwner(docId: string, login: string): Promise<boolean> {
        try  {
            const user = await this.userService.findByUserName(login);
            const document = await this.findOne(docId);
            return document.ownerId === user.id;
        }
        catch (_) {
            throw _;
        }
    }


    public async matchGoodAccessRight(docId: string, login: string): Promise<boolean> {
        try  {
            const user = await this.userService.findByUserName(login);
            const document = await this.findOne(docId);
            if (document.ownerId === user.id) return true;
            else {
                if (document.viewers.findIndex((acc) => acc.userId === user.id) > -1) return true;
                else return false;
            }
        }
        catch (_) {
            throw _;
        }
    }
}
