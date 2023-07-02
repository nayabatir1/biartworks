import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { UsersModule } from '../users/users.module';
import { jwtOptions } from '../config/jwtOptions';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [UsersModule, EmailModule, JwtModule.register(jwtOptions)],
})
export class AuthModule {}
