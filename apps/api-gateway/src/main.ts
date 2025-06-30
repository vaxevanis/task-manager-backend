import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@task-manager/auth';
import cookieParser from 'cookie-parser';
import { RateLimiterGuard } from '@task-manager/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
    ], // allow frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws if extra properties
      transform: true, // converts payload to DTO instance
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // app.useGlobalGuards(new RateLimiterGuard());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
// This will raise a lint warning a (@typescript-eslint/no-floating-promises)
bootstrap();
