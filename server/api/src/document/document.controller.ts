import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFiles, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentStorageService } from './document-storage.service';
import { PassThrough } from 'stream';
import { OwnerGuard } from 'src/decorator/owner.guard';
import { AccessRightGuard } from 'src/decorator/access-right.guard';
import { UserService } from 'src/user/user.service';

@Controller('document')
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly documentStorageService: DocumentStorageService,
        private readonly userService: UserService
    ) { }

    @UseGuards(AccessRightGuard)
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

    @Get('/folderId/:folderId') //TODO: Demander à la kok si c'est safe
    public async findAll (@Param('folderId') folderId: string, @Request() req): Promise<Document[]> {
      const user = await this.userService.findByUserName(req.user.login);
      return await this.documentService.findAll(user, folderId);
    }

    @Get('shared_with_me/:userId')
    public async findAllSharedWithMe (@Param('userId') userId: string): Promise<Document[]> {
        return await this.documentService.findAllSharedWithMe(userId);
    }


    @UseGuards(AccessRightGuard)
    @Get(':id')
    public async findOne (@Param('id') id: string): Promise<Document> {
        return await this.documentService.findOne(id);
    }

    @Patch(':id/my_access_right/:userId')
    async removeMyAccessRight(@Param('id') id: string, @Param('userId') userId: string): Promise<void> {
      return await this.documentService.removeMyAccessRight(id, userId);
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

    @Post('upload/:folderId')
    @UseInterceptors(FilesInterceptor('file', 50))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Param('folderId') folderId: string, @Request() req): Promise<Document[]> {
      const user = await this.userService.findByUserName(req.user.login);
      return await this.documentService.bulkAddFiles(files, user ,folderId);
    }
    
    @UseGuards(OwnerGuard)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Document> {
      return await this.documentService.deleteADocument(id);
    }
}
