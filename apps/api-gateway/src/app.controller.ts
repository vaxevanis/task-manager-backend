import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser, JwtAuthGuard } from '@task-manager/auth';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser() user: { userId: string; email: string; role: string }) {
    const sessionUser = await this.userService.findById(user.userId);
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      role: sessionUser.role,
      name: sessionUser.name
    };
  }

}
