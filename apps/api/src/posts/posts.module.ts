import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminPostsController } from './admin-posts.controller';
import { MediaService } from './media.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TranslationsService } from './translations.service';

@Module({
  imports: [AuthModule],
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService, TranslationsService, MediaService],
  exports: [PostsService],
})
export class PostsModule {}
