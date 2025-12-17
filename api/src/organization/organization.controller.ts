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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/entity-organization';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { createOrganizationSchema } from './schemas/create-organization.schema';
import { updateOrganizationSchema } from './schemas/update-organization.schema';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
    @Get()
    findAll(): Promise<Organization[]> {
        return this.organizationService.findAll();
    }
    @Get('active')
    findAllActive(): Promise<Organization[]> {
        return this.organizationService.findAllActive();
    }

    @Get('id/:id')
    findOne(@Param('id') id: number): Promise<Organization> {
        return this.organizationService.findOneById(id);
    }

    @Get('name/:name')
    findOneByName(@Param('name') name: string): Promise<Organization[]> {
        return this.organizationService.findByName(name);
    }

    @Post()
    create(@Body() body: CreateOrganizationDto): Promise<Organization> {
        const { error, value } = createOrganizationSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.organizationService.create(value);
    }
    @Patch('/restore/:id')
    restore(@Param('id') id: number): Promise<Organization> {
        return this.organizationService.restore(id);
    }
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() body: UpdateOrganizationDto,
        @Req() req: any,
    ): Promise<Organization> {
        const { error, value } = updateOrganizationSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        const user_id: number = req.session.user?.id;
        return this.organizationService.update(id, value, user_id);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<Organization> {
        return this.organizationService.delete(id);
    }
}
