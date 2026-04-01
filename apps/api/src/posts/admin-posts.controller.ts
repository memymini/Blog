import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { ok, paginated } from '../common/response.util';
import {
  AdminPostDetailSchema,
  AdminPostListItemSchema,
  CountrySchema,
  PostMediaSchema,
  PostSchema,
  PostTranslationSchema,
  apiPaginatedRes,
  apiRes,
} from '../common/swagger.schemas';
import { CreateMediaDto } from './dto/create-media.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { AdminListPostsQueryDto } from './dto/list-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MediaService } from './media.service';
import { PostsService } from './posts.service';

@ApiTags('admin / posts')
@ApiBearerAuth('supabase-jwt')
@UseGuards(AdminGuard)
@ApiExtraModels(
  CountrySchema,
  PostSchema,
  PostTranslationSchema,
  PostMediaSchema,
  AdminPostListItemSchema,
  AdminPostDetailSchema,
)
@Controller('admin/posts')
export class AdminPostsController {
  constructor(
    private readonly posts: PostsService,
    private readonly media: MediaService,
  ) {}

  // ── Posts ─────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all posts (including unpublished)' })
  @ApiOkResponse(apiPaginatedRes({ $ref: getSchemaPath(AdminPostListItemSchema) }))
  async findAll(@Query() query: AdminListPostsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { data, total } = await this.posts.listAll(page, limit);
    return paginated(data, total, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post with all translations and media' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(AdminPostDetailSchema) }))
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.posts.findOneAdmin(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post (optionally with inline translations)' })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(AdminPostDetailSchema) }))
  async create(@Body() dto: CreatePostDto) {
    return ok(await this.posts.create(dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post fields and/or upsert translations atomically' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(AdminPostDetailSchema) }))
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return ok(await this.posts.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post (cascades translations and media)' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.posts.remove(id);
  }

  // ── Cover image ───────────────────────────────────────────────────────────

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload cover image — URL persisted to posts.cover_url' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file (jpeg / png / webp)' },
      },
    },
  })
  @ApiOkResponse(apiRes({
    type: 'object',
    properties: { url: { type: 'string', example: 'https://example.com/post-images/cover.jpg' } },
  }))
  async uploadCover(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return ok(await this.media.uploadCover(id, file));
  }

  // ── Media ─────────────────────────────────────────────────────────────────

  @Get(':id/media')
  @ApiOperation({ summary: 'List media assets attached to a post' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse(apiRes({ type: 'array', items: { $ref: getSchemaPath(PostMediaSchema) } }))
  async listMedia(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.media.list(id));
  }

  @Post(':id/media/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a media image file — returns the public URL' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Image file (jpeg / png / webp)' },
      },
    },
  })
  @ApiOkResponse(apiRes({
    type: 'object',
    properties: { url: { type: 'string', example: 'https://example.com/post-images/1/media-123.jpg' } },
  }))
  async uploadMediaFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return ok(await this.media.uploadMediaFile(id, file));
  }

  @Post(':id/media')
  @ApiOperation({ summary: 'Add a media asset (image / video / embed URL) to a post' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(PostMediaSchema) }))
  async addMedia(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMediaDto,
  ) {
    return ok(await this.media.add(id, dto));
  }

  @Delete(':id/media/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a media asset from a post' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiParam({ name: 'mediaId', type: 'integer', example: 1 })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ) {
    return this.media.remove(id, mediaId);
  }
}
