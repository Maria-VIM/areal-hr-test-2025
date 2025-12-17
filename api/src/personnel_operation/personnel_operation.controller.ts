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
} from '@nestjs/common';
import { PersonnelOperationService } from './personnel_operation.service';
import { PersonnelOperation } from './enitites/entity-personnel_operation';
import { CreatePersonnelOperationDto } from './dto/create-personnel_operation.dto';
import { CreatePersonnelOperationSchema } from './schemas/create-personnel_operation.schemas';
import { UpdatePersonnelOperationDto } from './dto/update-personnel_operation.dto';
import { UpdatePersonnelOperationSchema } from './schemas/update-personnel_operation.schemas';

@Controller('personnel-operation')
export class PersonnelOperationController {
    constructor(
        private readonly personnelOperationService: PersonnelOperationService,
    ) {}
    @Get('/employee_id/:employee_id')
    async getAllById(
        @Param('employee_id') employee_id: number,
    ): Promise<PersonnelOperation[]> {
        return this.personnelOperationService.findAllById(employee_id);
    }
    @Get('id/:id')
    async getById(@Param('id') id: number): Promise<PersonnelOperation> {
        return this.personnelOperationService.findOneById(id);
    }
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<PersonnelOperation> {
        return this.personnelOperationService.delete(id);
    }
    @Post()
    async create(
        @Body() body: CreatePersonnelOperationDto,
    ): Promise<PersonnelOperation> {
        const { error, value } = CreatePersonnelOperationSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.personnelOperationService.create(value);
    }
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UpdatePersonnelOperationDto,
        @Req() req: any,
    ): Promise<PersonnelOperation> {
        const { error, value } = UpdatePersonnelOperationSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        const user_id: number = req.session.user?.id;
        return this.personnelOperationService.update(id, value, user_id);
    }
}
