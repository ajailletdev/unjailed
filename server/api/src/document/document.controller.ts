import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentStorageService } from './document-storage.service';
import { PassThrough } from 'stream';
import { OwnerGuard } from 'src/decorator/owner.guard';

@Controller('document')
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly documentStorageService: DocumentStorageService,
    ) { }

    @UseGuards(OwnerGuard)
    @Get('preview/:id')
    async seeUploadedFile(@Param('id') id: string, @Res() res) {
      const document = await this.documentService.findOne(id);

      if(!document){ 
        return res.sendStatus(404);
      }

      const buffer = await this.documentStorageService.getFile(document.id);
      const readStream = new PassThrough();
      readStream.end(buffer);

      const fallbackFileName = document.originalName.normalize('NFKD').replace(/[^a-zA-Z0-9\._-]/g, ''); // wrapping in encodeURIComponent() seems unnecessary after that
      const encodedFileName = encodeURIComponent(document.originalName);

      res.set({
        'Content-Type': document.mime,
        'Content-Disposition': `attachment: filename="${fallbackFileName}; filename*=UTF-8''${ encodedFileName }"`
      });

      readStream.once('error', (err) => {
        console.error(err);
        res.sendStatus(500);
      });
      
      readStream.pipe(res);
      readStream.end();
    }

    @Get('/user/:userId')
    public async findAll (@Param('userId') userId: string): Promise<Document[]> {
        return await this.documentService.findAll(userId);
    }

    @UseGuards(OwnerGuard)
    @Get(':id')
    public async findOne (@Param('id') id: string): Promise<Document> {
        return await this.documentService.findOne(id);
    }

    @UseGuards(OwnerGuard)
    @Patch(':id/filename/:name')
    async editFilename(@Param('id') id: string, @Param('name') name: string): Promise<Document> {
      return await this.documentService.editFilename(id, name);
    }

    @UseGuards(OwnerGuard)
    @Patch(':id/addViewer/:userId')
    async addViewer(@Param('id') id: string, @Param('userId') userId: string): Promise<Document> {
      return await this.documentService.addAViewer(id, userId);
    }

    @UseGuards(OwnerGuard)
    @Patch(':id/removeViewer/:userId')
    async removeViewer(@Param('id') id: string, @Param('userId') userId: string): Promise<Document> {
      return await this.documentService.removeAViewer(id, userId);
    }

    @Post('get_previews')
    @UseInterceptors()
    async getPreviewsFromIds(@Body() ids: string[], @Res() res): Promise<any> {
        // return await this.documentService.bulkAddFiles(files, ownerId);
    }

    @Post('upload/:ownerId')
    @UseInterceptors(FilesInterceptor('file', 50))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Param('ownerId') ownerId: string): Promise<Document[]> {
        return await this.documentService.bulkAddFiles(files, ownerId);
    }
    
    @UseGuards(OwnerGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Document> {
      return await this.documentService.deleteADocument(id);
    }
}
