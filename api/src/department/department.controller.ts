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
import { DepartmentService } from './department.service';
import { Department } from './entities/entity-department';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { updateDepartmentSchema } from './schemas/update-department.schema';
import { createDepartmentSchema } from './schemas/create-department.schema';
@Controller('department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}
    @Get('/organization/:organization_id')
    findAll(
        @Param('organization_id') organization_id: number,
    ): Promise<Department[]> {
        return this.departmentService.findAllByOrganizationId(organization_id);
    }
    @Get('/id/:id')
    findOne(@Param('id') id: number): Promise<Department> {
        return this.departmentService.findOneById(id);
    }
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.departmentService.delete(id);
    }
    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateDepartmentDto) {
        const { error, value } = updateDepartmentSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.departmentService.update(id, value);
    }
    @Patch('/restore/:id')
    restore(@Param('id') id: number) {
        return this.departmentService.restore(id);
    }
    @Post()
    create(@Body() body: CreateDepartmentDto) {
        const { error, value } = createDepartmentSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.departmentService.create(value);
    }
}
