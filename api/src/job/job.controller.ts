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
import { JobService } from './job.service';
import { Job } from './entities/entity-job';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { createJobSchema } from './schemas/create-job.schema';
import { updateJobSchema } from './schemas/update-job.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}
    @Get()
    @UseGuards(AuthGuard('session'))
    async findAll(
        @Req() req: any,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
    ): Promise<any> {
        if (req.session.user) {
            return await this.jobService.findAll(page, pageSize);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('active')
    @UseGuards(AuthGuard('session'))
    findAllActive(@Req() req: any): Promise<Job[]> {
        if (req.session.user) {
            return this.jobService.findAllActive();
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('id/:id')
    @UseGuards(AuthGuard('session'))
    findOneById(@Param('id') id: number, @Req() req: any): Promise<Job> {
        if (req.session.user) {
            return this.jobService.findOneById(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Get('name/:name')
    @UseGuards(AuthGuard('session'))
    async findByName(
        @Req() req: any,
        @Param('name') name: string,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
    ): Promise<any> {
        if (req.session.user) {
            return await this.jobService.findByName(name, page, pageSize);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Delete(':id')
    @UseGuards(AuthGuard('session'))
    delete(@Param('id') id: number, @Req() req: any): Promise<Job> {
        if (req.session.user) {
            return this.jobService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
    @Post()
    @UseGuards(AuthGuard('session'))
    create(@Body() body: CreateJobDto, @Req() req: any): Promise<Job> {
        if (req.session.user) {
            const { error, value } = createJobSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            return this.jobService.create(value);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Patch('/restore/:id')
    @UseGuards(AuthGuard('session'))
    restore(@Param('id') id: number, @Req() req: any): Promise<Job> {
        if (req.session.user) {
            return this.jobService.restore(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Patch(':id')
    @UseGuards(AuthGuard('session'))
    update(
        @Param('id') id: number,
        @Body() body: UpdateJobDto,
        @Req() req: any,
    ): Promise<Job> {
        if (req.session.user) {
            const { error, value } = updateJobSchema.validate(body);
            if (error) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: error.details,
                });
            }
            const user_id: number = req.session.user?.id;
            return this.jobService.update(id, value, user_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
