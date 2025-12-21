import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { File } from './entity/entity-file';
import { FileService } from './file.service';
import { editFileName, imageFileFilter } from '../utils/file-upload';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateFileSchema } from './schemas/create-file.schema';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'node:fs';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}
    @Get('/employee_id/:employee_id')
    async getFileByEmployeeId(
        @Param('employee_id') employee_id: number,
    ): Promise<File[]> {
        return this.fileService.findAllByEmployee(employee_id);
    }

    @Get('/download/:id')
    async downloadFile(@Param('id') id: number, @Res() res: express.Response) {
        const file = await this.fileService.findOneByIdForDownload(id);
        if (!file) {
            throw new NotFoundException('File not found');
        }
        const filePath = join(
            process.cwd(),
            'uploads/passports',
            file.full_name,
        );
        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }
        return res.download(filePath, file.full_name);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<File> {
        return this.fileService.delete(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/passports',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadedFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateFileDto,
    ) {
        body.full_name = file.filename;
        const { error, value } = CreateFileSchema.validate(body);
        if (error) {
            throw new BadRequestException({
                message: 'Validation failed',
                details: error.details,
            });
        }
        const response = await this.fileService.create(value);
        return {
            status: HttpStatus.OK,
            message: 'File uploaded successfully.',
            data: response,
        };
    }
}
