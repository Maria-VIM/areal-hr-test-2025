import { Module } from '@nestjs/common';

import { OrganizationModule } from './organization/organization.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { DepartmentModule } from './department/department.module';
import { JobModule } from './job/job.module';
import { EmployeeModule } from './employee/employee.module';
import { PersonnelOperationModule } from './personnel_operation/personnel_operation.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads/passports',
        }),
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal: true,
        }),
        OrganizationModule,
        DbModule,
        DepartmentModule,
        JobModule,
        EmployeeModule,
        PersonnelOperationModule,
        FileModule,
    ],
})
export class AppModule {}
