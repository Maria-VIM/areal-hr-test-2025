import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor() {}
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Req() req: any) {
        return {
            user: req.user,
            message: 'Login successful',
        };
    }
}
