import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 10, // max 10 requests
  duration: 60, // per 60 seconds
});

@Injectable()
export class RateLimiterGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const key = req.ip; // or req.user.id for auth-based

    try {
      await rateLimiter.consume(key);
      return true;
    } catch (err) {
      throw new BadRequestException("Rate limit exceeded");
    }
  }
}
