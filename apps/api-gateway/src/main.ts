import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws if extra properties
      transform: true, // converts payload to DTO instance
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
// This will raise a lint warning a (@typescript-eslint/no-floating-promises)
bootstrap();
