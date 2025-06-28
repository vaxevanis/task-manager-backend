import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "@task-manager/prisma";

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService
  ) { }

  async signup(dto: SignupDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: hashed,
        role: "USER",
      },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.hashedPassword))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.signToken(user.id, user.email, user.role);
    const refreshToken = await this.signToken(user.id, user.email, user.role, '7d');

    // Return full user info along with token
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user) throw new UnauthorizedException();
      const accessToken = await this.signToken(user.id, user.email, user.role);

      return { accessToken }
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async signToken(
    userId: string,
    email: string,
    role: string,
    expiresIn?: string | number
  ) {
    const payload = { sub: userId, email, role };

    return {
      token: await this.jwt.signAsync(payload, expiresIn ? { expiresIn } : undefined),
    };
  }
}
