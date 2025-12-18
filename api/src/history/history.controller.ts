import {
    Controller,
    Get,
    Param,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { history } from './entities/entity-history';
import { AuthGuard } from '@nestjs/passport';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}
    @Get(`:entity/:id`)
    @UseGuards(AuthGuard('session'))
    async getAll(
        @Param('entity') entity: string,
        @Param('id') id: number,
        @Req() req: any,
    ): Promise<history[]> {
        if (req.session.user) {
            return this.historyService.getAll(entity, id);
        } else {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
