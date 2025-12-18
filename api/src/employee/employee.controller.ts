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
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/entity-employeee';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { createEmployeeSchema } from './schemas/create-employee.schema';
import { updateEmployeeSchema } from './schemas/update-employee.schema';
import { AuthGuard } from '@nestjs/passport';
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}
    @Get('')
    @UseGuards(AuthGuard('session'))
    getAll(
        @Req() req: any,
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
        if (req.session.user) {
            return this.employeeService.findAll(
                page,
                pageSize,
                organization_id,
                department_id,
                name,
                is_deleted,
            );
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('/trainees')
    @UseGuards(AuthGuard('session'))
    getAllTrainees(
        @Req() req: any,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('name') name?: string,
    ): Promise<{
        employees: Employee[];
        totalPages: number;
        totalCount: number;
    }> {
        if (req.session.user) {
            return this.employeeService.findTrainees(page, pageSize, name);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('/active')
    @UseGuards(AuthGuard('session'))
    getAllActive(@Req() req: any): Promise<Employee[]> {
        if (req.session.user) {
            return this.employeeService.findAllActive();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('/id/:id')
    @UseGuards(AuthGuard('session'))
    getById(@Param('id') id: number, @Req() req: any): Promise<Employee> {
        if (req.session.user) {
            return this.employeeService.findOneById(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Post()
    @UseGuards(AuthGuard('session'))
    create(
        @Body() body: CreateEmployeeDto,
        @Req() req: any,
    ): Promise<Employee> {
        if (req.session.user) {
            const { error, value } = createEmployeeSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.employeeService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Patch(':id')
    @UseGuards(AuthGuard('session'))
    update(
        @Param('id') id: number,
        @Body() body: UpdateEmployeeDto,
        @Req() req: any,
    ): Promise<Employee> {
        if (req.session.user) {
            const { error, value } = updateEmployeeSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            const user_id = req.session.user?.id;
            return this.employeeService.update(id, value, user_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('session'))
    delete(@Param('id') id: number, @Req() req: any): Promise<Employee> {
        if (req.session.user) {
            return this.employeeService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
