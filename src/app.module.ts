import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { V1Module } from './v1/v1.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const conn = config.get<string>('DB_CONN')
        const database = config.get<string>('DB_NAME')

        return {
          uri: conn,
          dbName: database,
        }
      },
    }),
    V1Module,
  ],
})
export class AppModule {}
