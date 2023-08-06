import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { V1Module } from './v1/v1.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     const host = config.get<string>('DB_HOST')
    //     const port = config.get<string>('DB_PORT')
    //     const user = config.get<string>('DB_USER')
    //     const password = config.get<string>('DB_PASSWORD')
    //     const database = config.get<string>('DB_DATABASE')
    //     const options = config.get<string>('DB_OPTIONS')

    //     return {
    //       uri: config.get<string>(
    //         `mongodb://${user}:${password}@${host}:${port}/${database}?${options}`,
    //       ),
    //     }
    //   },
    // }),
    V1Module,
  ],
})
export class AppModule {}
