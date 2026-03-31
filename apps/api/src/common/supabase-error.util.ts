import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

interface PostgrestErrorLike {
  code: string;
  message: string;
}

/**
 * Throws a NestJS HTTP exception based on the Supabase PostgREST error.
 * PGRST116 = no rows found → NotFoundException (when notFoundMessage is provided)
 * All other errors → InternalServerErrorException
 */
export function throwOnError(
  error: PostgrestErrorLike | null,
  notFoundMessage?: string,
): void {
  if (!error) return;
  if (notFoundMessage && error.code === 'PGRST116') {
    throw new NotFoundException(notFoundMessage);
  }
  throw new InternalServerErrorException(error.message);
}
