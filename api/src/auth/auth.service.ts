import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthUser } from './entities/auth-entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
    async validateUser(login: string, password: string) {
        const currentUser: AuthUser =
            await this.userService.findOneByLogin(login);
        if (
            currentUser &&
            currentUser.is_active &&
            currentUser.deleted_at == null
        ) {
            const isMatch: Promise<boolean> = argon2.verify(
                currentUser.password,
                password,
            );
            if (await isMatch) {
                const { password, ...result } = currentUser;
                return result;
            }
        }
        return null;
    }
}
