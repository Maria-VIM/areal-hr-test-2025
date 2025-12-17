import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [HistoryModule],
    controllers: [OrganizationController],
    providers: [OrganizationService],
})
export class OrganizationModule {}
