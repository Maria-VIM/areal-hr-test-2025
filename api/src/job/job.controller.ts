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
import { JobService } from './job.service';
import { Job } from './entities/entity-job';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { createJobSchema } from './schemas/create-job.schema';
import { updateJobSchema } from './schemas/update-job.schema';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}
    @Get()
    findAllActive(): Promise<Job[]> {
        return this.jobService.findAllActive();
    }
    @Get('id/:id')
    findOneById(@Param('id') id: number): Promise<Job> {
        return this.jobService.findOneById(id);
    }
    @Get('name/:name')
    findByName(@Param('name') name: string): Promise<Job[]> {
        return this.jobService.findByName(name);
    }
    @Delete(':id')
    delete(@Param('id') id: number): Promise<Job> {
        return this.jobService.delete(id);
    }
    @Post()
    create(@Body() body: CreateJobDto): Promise<Job> {
        const { error, value } = createJobSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.jobService.create(value);
    }
    @Patch('/restore/:id')
    restore(@Param('id') id: number): Promise<Job> {
        return this.jobService.restore(id);
    }
    @Patch(':id')
    update(@Param('id') id: number, @Body() body: UpdateJobDto): Promise<Job> {
        const { error, value } = updateJobSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.jobService.update(id, value);
    }
}
