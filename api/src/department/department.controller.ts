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
import { DepartmentService } from './department.service';
import { Department } from './entities/entity-department';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { updateDepartmentSchema } from './schemas/update-department.schema';
import { createDepartmentSchema } from './schemas/create-department.schema';
import { AuthGuard } from '@nestjs/passport';
@Controller('department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}
    @Get('/organization/:organization_id')
    @UseGuards(AuthGuard('session'))
    findAll(
        @Param('organization_id') organization_id: number,
        @Req() req: any,
    ): Promise<Department[]> {
        if (req.session.user) {
            return this.departmentService.findAllByOrganizationId(
                organization_id,
            );
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('/active/organization/:organization_id')
    @UseGuards(AuthGuard('session'))
    findAllActive(
        @Param('organization_id') organization_id: number,
        @Req() req: any,
    ): Promise<Department[]> {
        if (req.session.user) {
            return this.departmentService.findAllActiveByOrganizationId(
                organization_id,
            );
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('/id/:id')
    @UseGuards(AuthGuard('session'))
    findOne(@Param('id') id: number, @Req() req: any): Promise<Department> {
        if (req.session.user) {
            return this.departmentService.findOneById(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Delete(':id')
    @UseGuards(AuthGuard('session'))
    delete(@Param('id') id: number, @Req() req: any): Promise<Department> {
        if (req.session.user) {
            return this.departmentService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch(':id')
    @UseGuards(AuthGuard('session'))
    update(
        @Param('id') id: number,
        @Body() body: UpdateDepartmentDto,
        @Req() req: any,
    ): Promise<Department> {
        if (req.session.user) {
            const { error, value } = updateDepartmentSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            const user_id: number = req.session.user?.id;
            return this.departmentService.update(id, value, user_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch('/restore/:id')
    @UseGuards(AuthGuard('session'))
    restore(@Param('id') id: number, @Req() req: any): Promise<Department> {
        if (req.session.user) {
            return this.departmentService.restore(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Post()
    @UseGuards(AuthGuard('session'))
    create(
        @Body() body: CreateDepartmentDto,
        @Req() req: any,
    ): Promise<Department> {
        if (req.session.user) {
            const { error, value } = createDepartmentSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.departmentService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
