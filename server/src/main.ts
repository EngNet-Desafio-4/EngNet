import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/nestjs/module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('EngNet API')
    .setDescription('Documentação da API EngNet')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
