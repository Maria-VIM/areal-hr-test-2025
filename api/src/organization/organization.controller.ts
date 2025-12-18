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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/entity-organization';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { createOrganizationSchema } from './schemas/create-organization.schema';
import { updateOrganizationSchema } from './schemas/update-organization.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
    @Get()
    @UseGuards(AuthGuard('session'))
    findAll(@Req() req: any): Promise<Organization[]> {
        if (req.session.user) {
            return this.organizationService.findAll();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('active')
    @UseGuards(AuthGuard('session'))
    findAllActive(@Req() req: any): Promise<Organization[]> {
        if (req.session.user) {
            return this.organizationService.findAllActive();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('id/:id')
    @UseGuards(AuthGuard('session'))
    findOne(@Param('id') id: number, @Req() req: any): Promise<Organization> {
        if (req.session.user) {
            return this.organizationService.findOneById(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('name/:name')
    @UseGuards(AuthGuard('session'))
    findOneByName(
        @Param('name') name: string,
        @Req() req: any,
    ): Promise<Organization[]> {
        if (req.session.user) {
            return this.organizationService.findByName(name);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Post()
    @UseGuards(AuthGuard('session'))
    create(
        @Body() body: CreateOrganizationDto,
        @Req() req: any,
    ): Promise<Organization> {
        if (req.session.user) {
            const { error, value } = createOrganizationSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.organizationService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch('/restore/:id')
    @UseGuards(AuthGuard('session'))
    restore(@Param('id') id: number, @Req() req: any): Promise<Organization> {
        if (req.session.user) {
            return this.organizationService.restore(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Patch(':id')
    @UseGuards(AuthGuard('session'))
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
    @UseGuards(AuthGuard('session'))
    delete(@Param('id') id: number, @Req() req: any): Promise<Organization> {
        if (req.session.user) {
            return this.organizationService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
