import { Module } from '@nestjs/common';
import { PersonnelOperationService } from './personnel_operation.service';
import { PersonnelOperationController } from './personnel_operation.controller';

@Module({
  controllers: [PersonnelOperationController],
  providers: [PersonnelOperationService],
})
export class PersonnelOperationModule {}
