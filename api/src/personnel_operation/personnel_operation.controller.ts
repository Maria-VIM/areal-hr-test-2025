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
import { PersonnelOperationService } from './personnel_operation.service';
import { PersonnelOperation } from './enitites/entity-personnel_operation';
import { CreatePersonnelOperationDto } from './dto/create-personnel_operation.dto';
import { CreatePersonnelOperationSchema } from './schemas/create-personnel_operation.schemas';
import { UpdatePersonnelOperationDto } from './dto/update-personnel_operation.dto';
import { UpdatePersonnelOperationSchema } from './schemas/update-personnel_operation.schemas';
import { AuthGuard } from '@nestjs/passport';

@Controller('personnel-operation')
export class PersonnelOperationController {
    constructor(
        private readonly personnelOperationService: PersonnelOperationService,
    ) {}
    @Get('/employee_id/:employee_id')
    @UseGuards(AuthGuard('session'))
    async getAllById(
        @Param('employee_id') employee_id: number,
        @Req() req: any,
    ): Promise<PersonnelOperation[]> {
        if (req.session.user) {
            return this.personnelOperationService.findAllById(employee_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('id/:id')
    @UseGuards(AuthGuard('session'))
    async getById(
        @Param('id') id: number,
        @Req() req: any,
    ): Promise<PersonnelOperation> {
        if (req.session.user) {
            return this.personnelOperationService.findOneById(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Delete(':id')
    @UseGuards(AuthGuard('session'))
    async delete(
        @Param('id') id: number,
        @Req() req: any,
    ): Promise<PersonnelOperation> {
        if (req.session.user) {
            return this.personnelOperationService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Post()
    @UseGuards(AuthGuard('session'))
    async create(
        @Body() body: CreatePersonnelOperationDto,
        @Req() req: any,
    ): Promise<PersonnelOperation> {
        if (req.session.user) {
            const { error, value } =
                CreatePersonnelOperationSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.personnelOperationService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch(':id')
    @UseGuards(AuthGuard('session'))
    async update(
        @Param('id') id: number,
        @Body() body: UpdatePersonnelOperationDto,
        @Req() req: any,
    ): Promise<PersonnelOperation> {
        if (req.session.user) {
            const { error, value } =
                UpdatePersonnelOperationSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            const user_id: number = req.session.user?.id;
            return this.personnelOperationService.update(id, value, user_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
