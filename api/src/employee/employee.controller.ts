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
import { EmployeeService } from './employee.service';
import { Employee } from './entities/entity-employeee';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { createEmployeeSchema } from './schemas/create-employee.schema';
import { updateEmployeeSchema } from './schemas/update-employee.schema';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}
    @Get('/organization/:organization_id')
    getAllByOrganization(
        @Param('organization_id') organization_id: number,
    ): Promise<Employee[]> {
        return this.employeeService.findAllActiveByOrganization(
            organization_id,
        );
    }

    @Get('/department/:department_id')
    getAllByDepartment(
        @Param('department_id') department_id: number,
    ): Promise<Employee[]> {
        return this.employeeService.findAllActiveByDepartment(department_id);
    }

    @Get('/deleted')
    getAllDeleted(): Promise<Employee[]> {
        return this.employeeService.findDeleted();
    }

    @Get('/trainees')
    getAllTrainees(): Promise<Employee[]> {
        return this.employeeService.findTrainees();
    }

    @Get('/name/:name')
    getByName(@Param('name') name: string): Promise<Employee[]> {
        return this.employeeService.findAllByName(name);
    }

    @Get('/id/:id')
    getById(@Param('id') id: number): Promise<Employee> {
        return this.employeeService.findOneById(id);
    }

    @Post()
    create(@Body() body: CreateEmployeeDto): Promise<Employee> {
        const { error, value } = createEmployeeSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.employeeService.create(value);
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() body: UpdateEmployeeDto,
    ): Promise<Employee> {
        const { error, value } = updateEmployeeSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.employeeService.update(id, value);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<Employee> {
        return this.employeeService.delete(id);
    }
}
