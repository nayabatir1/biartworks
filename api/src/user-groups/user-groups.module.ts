import { Module } from '@nestjs/common';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';

@Module({
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
