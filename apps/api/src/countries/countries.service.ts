import { Injectable } from '@nestjs/common';
import type { Country } from '@repo/types';
import { throwOnError } from '../common/supabase-error.util';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CountriesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Country[]> {
    const { data, error } = await this.supabase.client
      .from('countries')
      .select('*')
      .order('name_en');

    throwOnError(error);
    return data as Country[];
  }
}
