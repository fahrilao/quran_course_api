import { Module } from '@nestjs/common'
import { CustomPropertiesService } from './custom-properties.service'
import { CustomPropertiesController } from './custom-properties.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomProperty, CustomPropertySchema } from './custom-properties.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomProperty.name, schema: CustomPropertySchema },
    ]),
  ],
  providers: [CustomPropertiesService],
  controllers: [CustomPropertiesController],
})
export class CustomPropertiesModule {}
