import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({select: ['login', 'password'] ,where: {login: username}})
  }

  async findByUserName(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({select: ['id', 'login'] ,where: {login: username}})
  }
}