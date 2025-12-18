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
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
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
import { AuthGuard } from '@nestjs/passport';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}
    @Get('/employee_id/:employee_id')
    @UseGuards(AuthGuard('session'))
    async getFileByEmployeeId(
        @Param('employee_id') employee_id: number,
        @Req() req: any,
    ): Promise<File[]> {
        if (req.session.user) {
            return this.fileService.findAllByEmployee(employee_id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('/download/:id')
    async downloadFile(
        @Param('id') id: number,
        @Res() res: express.Response,
        @Req() req: any,
    ) {
        if (req.session.user) {
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
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('session'))
    async delete(@Param('id') id: number, @Req() req: any): Promise<File> {
        if (req.session.user) {
            return this.fileService.delete(id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Post()
    @UseGuards(AuthGuard('session'))
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
        @Req() req: any,
    ) {
        if (req.session.user) {
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
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
