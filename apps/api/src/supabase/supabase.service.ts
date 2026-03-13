import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  /** Read-only client (anon key) — subject to RLS. Use for public data fetches. */
  readonly client: SupabaseClient;

  /** Admin client (service role key) — bypasses RLS. Use for CUD operations. */
  readonly adminClient: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const anonKey = this.config.getOrThrow<string>('SUPABASE_ANON_KEY');
    const serviceRoleKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.client = createClient(url, anonKey);
    this.adminClient = createClient(url, serviceRoleKey);
  }
}
