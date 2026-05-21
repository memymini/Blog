import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { createSupabaseMock } from '../__test-utils__/supabase.mock';
import { AdminGuard } from './admin.guard';

function makeContext(authHeader?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: authHeader ? { authorization: authHeader } : {},
        cookies: {},
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let supabaseMock: ReturnType<typeof createSupabaseMock>;

  beforeEach(() => {
    supabaseMock = createSupabaseMock();
    guard = new AdminGuard(supabaseMock as never);
  });

  it('throws UnauthorizedException when no token is present', async () => {
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when Supabase reports an invalid token', async () => {
    (supabaseMock.client.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'JWT expired' },
    });

    await expect(
      guard.canActivate(makeContext('Bearer expired-token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws ForbiddenException when the authenticated user is not an admin', async () => {
    (supabaseMock.client.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'u1', app_metadata: { role: 'viewer' } } },
      error: null,
    });

    await expect(
      guard.canActivate(makeContext('Bearer viewer-token')),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns true for a valid admin token', async () => {
    (supabaseMock.client.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'admin-1', app_metadata: { role: 'admin' } } },
      error: null,
    });

    await expect(
      guard.canActivate(makeContext('Bearer admin-token')),
    ).resolves.toBe(true);
  });
});
