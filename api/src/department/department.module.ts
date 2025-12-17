import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [HistoryModule],
    controllers: [DepartmentController],
    providers: [DepartmentService],
})
export class DepartmentModule {}
