import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor (
        private userService: UserService
    ) { }

    @Get()
    public async findAll (): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Get('/:login')
    public async findWithLogin (@Param('login') login: string): Promise<User> {
        return await this.userService.findByUserName(login);
    }
    
}

