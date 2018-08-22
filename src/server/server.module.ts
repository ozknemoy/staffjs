import { Module } from '@nestjs/common';


import { EventsGateway } from './events.gateway.';
import {MainModule} from './components/main.module';
import {StaticModule} from './static-module/static.module';


@Module({
  imports: [MainModule, StaticModule],
  controllers: [],
  components: [EventsGateway, ]
})
export class ApplicationModule {}
