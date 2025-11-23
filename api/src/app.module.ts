import { Module } from '@nestjs/common';

import { OrganizationModule } from './organization/organization.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { DepartmentModule } from './department/department.module';
import { JobModule } from './job/job.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal: true,
        }),
        OrganizationModule,
        DbModule,
        DepartmentModule,
        JobModule,
    ],
})
export class AppModule {}
