import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '@task-manager/auth';
import { Request } from 'express';

@Controller('test')
export class TestController {
  /**
   * Protected route with JWT authentication
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected(@Req() req: Request) {
    return {
      message: 'You have access to protected route',
      user: req.user, // User info from JWT payload
    };
  }

  /**
   * Admin-only route with JWT auth + role check
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdmin(@Req() req: Request) {
    return {
      message: 'You have admin access',
      user: req.user,
    };
  }
}
