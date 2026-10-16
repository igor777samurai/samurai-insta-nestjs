import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { InctaPlatformModule } from './modules/incta-platform/incta-platform.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import {AccountModule} from "./modules/account/account.module.js";


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    CqrsModule,
    InctaPlatformModule,
    AccountModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'samurai-incta',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
