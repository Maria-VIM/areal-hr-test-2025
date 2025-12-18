import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entity/entity-user';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSchema } from './schemas/update-user.schema';
import { Roles } from './entity/entity-role';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('')
    @UseGuards(AuthGuard('session'))
    getAll(@Req() req: any): Promise<Users[]> {
        if (req.session.user) {
            return this.userService.findAll();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('roles')
    @UseGuards(AuthGuard('session'))
    getAllJob(@Req() req: any): Promise<Roles[]> {
        if (req.session.user) {
            return this.userService.findAllRoles();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('id/:id')
    @UseGuards(AuthGuard('session'))
    getById(@Param('id') id: number, @Req() req: any): Promise<Users> {
        if (req.session.user) {
            return this.userService.findOne(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Delete('/:id')
    @UseGuards(AuthGuard('session'))
    delete(@Param('id') id: number, @Req() req: any): Promise<Users> {
        if (req.session.user) {
            return this.userService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Post()
    @UseGuards(AuthGuard('session'))
    create(@Body() body: CreateUserDto, @Req() req: any): Promise<Users> {
        if (req.session.user) {
            const { error, value } = CreateUserSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.userService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch('id/:id')
    @UseGuards(AuthGuard('session'))
    update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
        @Req() req: any,
    ): Promise<Users> {
        if (req.session.user) {
            const { error, value } = UpdateUserSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.userService.update(id, value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch('activation/:id')
    @UseGuards(AuthGuard('session'))
    activation(@Param('id') id: number, @Req() req: any): Promise<Users> {
        if (req.session.user) {
            return this.userService.activation(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch('deactivation/:id')
    @UseGuards(AuthGuard('session'))
    deactivation(@Param('id') id: number, @Req() req: any): Promise<Users> {
        if (req.session.user) {
            return this.userService.deactivation(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
