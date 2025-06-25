import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@task-manager/auth';
import { TestController } from './test.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
