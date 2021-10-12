import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { last } from 'rxjs';
import { User } from 'src/user/user.entity';
import { Not, Repository } from 'typeorm';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>,
    ) { }

    public async addOne (folderName: string, parentFolderName: string, user: User): Promise<Folder> {

        const parrentFolder = await this.folderRepository.findOne({ 
            where: {userId: user.id, name: parentFolderName},
            relations: [ 'childFolders' ]
        });

        if (!parrentFolder) {
            throw new NotFoundException('Parent folder not found');
        }

        if (parrentFolder.childFolders.findIndex((fold) => fold.name === folderName) > -1) {
            throw new BadRequestException('A folder with the same name in the same folder already exist');
        }

        const folder = new Folder({
            name: folderName,
            parentFolderId: parrentFolder.id,
            userId: user.id
        })

        return await this.folderRepository.save(folder);
    }

    public async findInitialByUser(user: User): Promise<Folder> {
        const folder = await this.folderRepository.findOne({
            where: {
                userId: user.id,
                name: '/'
            },
            relations: [ 'childFolders' ]
        });

        if (!folder) {
            throw new NotFoundException("Initial folder not found");
        }

        return folder;
    }

    public async findFoldersFromParent(parentFolderId: string, user: User): Promise<Folder[]> {
        try {
            const parentFolder = await this.folderRepository.findOne({ where: { id: parentFolderId }});

            if (!parentFolder) {
                throw new NotFoundException("Parent folder not found");
            }

            if (parentFolder.userId !== user.id) {
                throw new BadRequestException("User unauthorized");
            }

            return await this.folderRepository.find({ where: {
                parentFolderId,
                id: Not(parentFolderId)
            }});

        } catch(_) {
            throw _;
        }
    }

    public async findCurrentfromLocation(location: string, user: User): Promise<Folder> {
        console.log(location);
        try {
            let lastFolder = await this.folderRepository.findOne({ where: {
                name: '/',
                userId: user.id
            }});
            console.log("init", lastFolder);

            const splitLocation = location.split('/');
            for (const loc in splitLocation) {
                lastFolder = await this.folderRepository.findOne({ where: {
                    name: loc,
                    parentFolderId: lastFolder.id
                }}); //TOFIX
                console.log("again", lastFolder);
            }

            return lastFolder;
        } catch(_) {
            throw _;
        }
    }

}
