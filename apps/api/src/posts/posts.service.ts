import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post } from '@repo/types';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PostsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Post[]> {
    const { data, error } = await this.supabase.client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Post[];
  }
}
