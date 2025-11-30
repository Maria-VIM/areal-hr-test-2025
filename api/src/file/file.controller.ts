import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { File } from './entity/entity-file';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateFileSchema } from './schemas/create-file.schema';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}
    @Get('/employee_id/:employee_id')
    async getFileByEmployeeId(
        @Param('employee_id') employee_id: number,
    ): Promise<File[]> {
        return this.fileService.findAllByEmployee(employee_id);
    }

    @Get('/id/:id')
    async getFileById(@Param('id') id: number): Promise<File> {
        return this.fileService.findOneById(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<File> {
        return this.fileService.delete(id);
    }

    @Post(':id')
    async create(
        @Param('id') id: number,
        @Body() body: CreateFileDto,
    ): Promise<File> {
        const { error, value } = CreateFileSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.fileService.create(id, value);
    }
}
