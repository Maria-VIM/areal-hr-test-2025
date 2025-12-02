import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { File } from './entity/entity-file';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateFileSchema } from './schemas/create-file.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'node:path';
import { diskStorage } from 'multer';

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

    @Post(':employee_id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/passport', // Ваша папка
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    callback(null, uniqueSuffix + ext);
                },
            }),
        }),
    )
    async uploadFile(
        @Param('employee_id') employee_id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateFileDto,
    ): Promise<File> {
        const { error, value } = CreateFileSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        return this.fileService.create(employee_id, {
            ...value,
            full_name: file.path,
        });
    }
}
