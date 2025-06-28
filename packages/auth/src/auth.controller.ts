import { Controller, Post, Body, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./public.decorator";
import { JwtAuthGuard } from "./jwt.auth.guard";
import { CookieGuard } from "./cookie.guard";
import { RefreshToken } from "./refresh-token.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }
  @Public()
  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @UseGuards(CookieGuard)
  async refresh(@RefreshToken() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

}
