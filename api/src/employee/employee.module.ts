import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [HistoryModule],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
