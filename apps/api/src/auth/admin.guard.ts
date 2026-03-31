import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    // Accept token from Authorization: Bearer header or httpOnly cookie
    const token: string | undefined = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : (request as unknown as { cookies?: Record<string, string> }).cookies?.['token'];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    const { data, error } = await this.supabase.client.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const role = (data.user.app_metadata as Record<string, unknown>)?.['role'];
    if (role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
