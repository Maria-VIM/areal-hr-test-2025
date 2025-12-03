import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(
            new HttpException(
                'Only .pdf files are supported',
                HttpStatus.BAD_REQUEST,
            ),
            false,
        );
    }
    callback(null, true);
};

export const editFileName = (req: any, file: any, callback: any) => {
    const name: string = file.originalname.split('.')[0];
    const fileExtName: string = extname(file.originalname);
    const randomName: string = Array(10)
        .fill(0)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${name}${randomName}${fileExtName}`);
};
