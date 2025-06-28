import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CookieGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();


        const refreshToken = request.cookies?.['refresh_token'];

        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token cookie');
        }

        // we could add extra logic here (e.g. token structure checks)
        return true;
    }
}
