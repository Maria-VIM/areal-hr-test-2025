import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    controllers: [AuthController],
    imports: [PassportModule],
    providers: [AuthService, UserService, LocalStrategy],
})
export class AuthModule {}
