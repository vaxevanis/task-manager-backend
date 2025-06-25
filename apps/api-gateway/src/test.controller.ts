import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('test')
export class TestController {
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected(@Req() req: Request) {
    return {
      message: 'You have access',
      user: req.user,
    };
  }
}
