import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
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
    @Get('')
    getAll(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('organization_id') organization_id?: number,
        @Query('department_id') department_id?: number,
        @Query('name') name?: string,
        @Query('is_deleted') is_deleted?: boolean,
    ): Promise<{
        employees: Employee[];
        totalPages: number;
        totalCount: number;
    }> {
        return this.employeeService.findAll(
            page,
            pageSize,
            organization_id,
            department_id,
            name,
            is_deleted,
        );
    }

    @Get('/trainees')
    getAllTrainees(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('name') name?: string,
    ): Promise<{
        employees: Employee[];
        totalPages: number;
        totalCount: number;
    }> {
        return this.employeeService.findTrainees(page, pageSize, name);
    }

    @Get('/active')
    getAllActive(): Promise<Employee[]> {
        return this.employeeService.findAllActive();
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
        @Req() req: any,
    ): Promise<Employee> {
        const { error, value } = updateEmployeeSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        const user_id = req.session.user?.id;
        return this.employeeService.update(id, value, user_id);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<Employee> {
        return this.employeeService.delete(id);
    }
}
