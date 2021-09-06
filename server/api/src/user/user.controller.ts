import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor (
        private userService: UserService
    ) { }

    @Get('/:login')
    public async findAll (@Param('login') login: string): Promise<User> {
        return await this.userService.findByUserName(login);
    }
    
}

