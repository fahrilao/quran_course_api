import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Quran Course Documentation')
      .setDescription("The Quran API's description")
      .setVersion('1.0')
      .addTag('users')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/', app, document)
  }

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
