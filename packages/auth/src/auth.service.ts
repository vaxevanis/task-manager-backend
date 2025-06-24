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
  ) {}

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

    return this.signToken(user.id, user.email, user.role);
  }

  private async signToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }
}
