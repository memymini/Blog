import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { throwOnError } from './supabase-error.util';

describe('throwOnError', () => {
  it('does not throw when error is null', () => {
    expect(() => throwOnError(null)).not.toThrow();
  });

  it('throws NotFoundException for PGRST116 when notFoundMessage is provided', () => {
    const error = { code: 'PGRST116', message: 'no rows found' };
    expect(() => throwOnError(error, 'Post 99 not found')).toThrow(
      NotFoundException,
    );
  });

  it('throws InternalServerErrorException for PGRST116 when notFoundMessage is omitted', () => {
    const error = { code: 'PGRST116', message: 'no rows found' };
    expect(() => throwOnError(error)).toThrow(InternalServerErrorException);
  });

  it('throws InternalServerErrorException for any non-PGRST116 error code', () => {
    const error = { code: '23503', message: 'foreign key violation' };
    expect(() => throwOnError(error, 'ignored')).toThrow(
      InternalServerErrorException,
    );
  });
});
