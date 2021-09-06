import { Injectable } from '@nestjs/common';
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

    public async removeOne (accessRight: AccessRight): Promise<AccessRight> {
        return await this.accessRightsRepository.remove(accessRight);
    }
}
