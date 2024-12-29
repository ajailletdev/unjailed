import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<string> {
    const user = await this.usersService.findOne(username);
    // if (user && await bcrypt.compare(pass, user.password)) {
    if (user && pass === user.password) {
      const { password, ...result } = user;
      return user.login;
    }
    return null;
  }

  async login(username: string) {
    const payload = { username };
    const userToReturn = await this.usersService.findByUserName(username);
    return {
      access_token: this.jwtService.sign(payload),
      user: userToReturn
    };
  }
}