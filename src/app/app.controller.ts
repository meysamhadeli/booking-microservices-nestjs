import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { RabbitmqService } from '../modules/rabbitmq/rabbitmq.service';
import { UserCreated } from '../events/userCreated';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly rabbitmqService: RabbitmqService,
    ) {}

    @Get('/')
    @HttpCode(302)
    index(@Res() res: Response) {
        res.redirect('/status');
    }
    @Get('/status')
    @HttpCode(200)
    info() {
        this.rabbitmqService.publishMessage(
            new UserCreated({ id: 1, name: 'meysam' }),
        );
        return this.appService.info();
    }
}
