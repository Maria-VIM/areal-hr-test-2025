import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { HistoryModule } from '../history/history.module';

@Module({
    controllers: [JobController],
    providers: [JobService],
    imports: [HistoryModule],
})
export class JobModule {}
