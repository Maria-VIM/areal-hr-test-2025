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
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { RedisModule } from './redis/redice.module';
import { APP_GUARD } from '@nestjs/core';
import { SessionGuard } from './auth/guards/session.guard';

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
        UserModule,
        AuthModule,
        HistoryModule,
        RedisModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: SessionGuard,
        },
    ],
})
export class AppModule {}
