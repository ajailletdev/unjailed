import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRightService } from './access-right.service';
import { AccessRight } from './access_right.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessRight])],
  providers: [AccessRightService],
  exports: [AccessRightService]
})
export class AccessRightModule {}
