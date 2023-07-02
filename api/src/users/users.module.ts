import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { EmailModule } from '../email/email.module';
import { UserGroupsModule } from '../user-groups/user-groups.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [UserGroupsModule, EmailModule],
  controllers: [UsersController],
})
export class UsersModule {}
