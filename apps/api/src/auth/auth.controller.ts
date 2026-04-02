import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SupabaseService } from '../supabase/supabase.service';
import { ok } from '../common/response.util';
import { AuthUserSchema, LoginResponseSchema, apiRes } from '../common/swagger.schemas';
import { AdminGuard } from './admin.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@ApiExtraModels(AuthUserSchema, LoginResponseSchema)
@Controller('auth')
export class AuthController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password', description: 'Returns access_token and refresh_token on success.' })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(LoginResponseSchema) }))
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message ?? 'Login failed');
    }

    return ok({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: (data.user.app_metadata as Record<string, unknown>)?.['role'] ?? null,
      },
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth('supabase-jwt')
  @ApiOperation({ summary: 'Sign out', description: 'Invalidates the current session server-side.' })
  @ApiNoContentResponse({ description: 'Signed out successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async logout(@Headers('authorization') auth: string) {
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    if (token) {
      await this.supabase.adminClient.auth.admin.signOut(token);
    }
  }

  @Get('me')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('supabase-jwt')
  @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user\'s profile from the Bearer token.' })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(AuthUserSchema) }))
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async me(@Headers('authorization') auth: string) {
    const token = auth.slice(7);
    const { data, error } = await this.supabase.client.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return ok({
      id: data.user.id,
      email: data.user.email,
      role: (data.user.app_metadata as Record<string, unknown>)?.['role'] ?? null,
      created_at: data.user.created_at,
    });
  }
}
