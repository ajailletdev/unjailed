import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRight } from './access_right.entity';

@Injectable()
export class AccessRightService {

    constructor(
        @InjectRepository(AccessRight)
        private accessRightsRepository: Repository<AccessRight>,
    ) { }

    public async addOne (accessRight: AccessRight): Promise<AccessRight> {
        return await this.accessRightsRepository.save(accessRight);
    }

    public async removeOne (documentId: string, userId: string): Promise<AccessRight> {
        const acc = await this.accessRightsRepository.findOne({ where: {
            documentId,
            userId
        }});
        if (!acc) throw new NotFoundException('Access right not found');
        return await this.accessRightsRepository.remove(acc);
    }
}
