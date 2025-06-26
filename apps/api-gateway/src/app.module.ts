import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@task-manager/auth';
import { TestController } from './test.controller';
import { TaskModule } from './tasks/task.modules';
import { UserService } from './user.service';
import { PrismaService } from '@task-manager/prisma';

@Module({
  imports: [AuthModule, TaskModule],
  controllers: [AppController, TestController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule { }
