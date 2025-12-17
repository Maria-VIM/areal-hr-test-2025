import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { history } from './entities/entity-history';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}
    @Get(`:entity/:id`)
    async getAll(
        @Param('entity') entity: string,
        @Param('id') id: number,
    ): Promise<history[]> {
        return this.historyService.getAll(entity, id);
    }
}
