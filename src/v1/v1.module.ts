import { Module } from '@nestjs/common'
import { AppController } from './v1.controller'
import { AppService } from './v1.service'

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class V1Module {}
