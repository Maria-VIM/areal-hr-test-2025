import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entity/entity-user';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSchema } from './schemas/update-user.schema';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('')
    getAll(): Promise<Users[]> {
        return this.userService.findAll();
    }
    @Get('id/:id')
    getById(@Param('id') id: number): Promise<Users> {
        return this.userService.findOne(id);
    }
    @Delete('id/:id')
    delete(@Param('id') id: number): Promise<Users> {
        return this.userService.delete(id);
    }
    @Post()
    create(@Body() body: CreateUserDto): Promise<Users> {
        const { error, value } = CreateUserSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.userService.create(value);
    }
    @Patch('id/:id')
    update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
    ): Promise<Users> {
        const { error, value } = UpdateUserSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.userService.update(id, value);
    }
    @Patch('activation/:id')
    activation(@Param('id') id: number): Promise<Users> {
        return this.userService.activation(id);
    }
    @Patch('deactivation/:id')
    deactivation(@Param('id') id: number): Promise<Users> {
        return this.userService.deactivation(id);
    }
}
