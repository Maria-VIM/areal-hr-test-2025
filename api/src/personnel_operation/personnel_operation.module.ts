import { Module } from '@nestjs/common';
import { PersonnelOperationService } from './personnel_operation.service';
import { PersonnelOperationController } from './personnel_operation.controller';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [HistoryModule],
    controllers: [PersonnelOperationController],
    providers: [PersonnelOperationService],
})
export class PersonnelOperationModule {}
