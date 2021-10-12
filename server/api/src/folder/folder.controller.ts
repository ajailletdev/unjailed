import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Folder } from './folder.entity';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
    
    constructor (
        private readonly folderService: FolderService,
        private readonly userService: UserService,
    ) {
    }

    @Get('from_location/:location')
    async getCurrentFromLocation(@Request() req, @Param('location') location: string): Promise<Folder> {
        const user = await this.userService.findByUserName(req.user.login);
        return await this.folderService.findCurrentfromLocation(location, user);
    }

    @Get('parent_folder/:folderId')
    async getFoldersFromParents(@Request() req, @Param('folderId') folderId: string): Promise<Folder[]> {
        const user = await this.userService.findByUserName(req.user.login);
        return await this.folderService.findFoldersFromParent(folderId, user);
    }

    @Get('initial_folder')
    async getInitialFolder(@Request() req): Promise<Folder> {
        const user = await this.userService.findByUserName(req.user.login);
        return await this.folderService.findInitialByUser(user);
    }

    @Post()
    async uploadFile(@Body() folder: { name: string, currentFolder: string }, @Request() req): Promise<Folder> {
        const user = await this.userService.findByUserName(req.user.login);
        return await this.folderService.addOne(folder.name, folder.currentFolder, user);
    }
}
