import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.filter';
import { FallBackExceptionFilter } from './filters/fallback.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationFilter } from './filters/validation.filter';
import { ValidationException } from './filters/validation.exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://127.0.0.1:3000/', 'http://localhost:3000', 'https://easy-generator-assessment.azurewebsites.net'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new FallBackExceptionFilter(), new HttpExceptionFilter(), new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const messages = errors.map(
        error => `${error.property} has wrong value ${error.value} ${Object.values(error.constraints).join(', ')}`,
      );
      return new ValidationException(messages);
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Easy-Generator')
    .setDescription("Authentication Module of Easy-Generator")
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8081);
}
bootstrap();
