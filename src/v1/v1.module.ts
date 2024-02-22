import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { CustomPropertiesModule } from './custom-properties/custom-properties.module';

@Module({
  imports: [UsersModule, CustomPropertiesModule],
})
export class V1Module {}
