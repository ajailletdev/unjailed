import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fsPromise } from 'fs';
@Injectable()
export class DocumentStorageService {

    private filePath: string;
    constructor (private configService: ConfigService) {
        this.filePath = this.configService.get('documents.filePath');
    }

    public async putFile(filename: string, buffer: Buffer): Promise<void> {
        await fsPromise.writeFile(`${this.filePath}/${filename}`, buffer);
    }

    public async getFile(filename: string): Promise<Buffer> {
        return await fsPromise.readFile(`${this.filePath}/${filename}`);
    }

    public async removeFile(filename: string): Promise<void> {
        return await fsPromise.unlink(`${this.filePath}/${filename}`);
    }


}
