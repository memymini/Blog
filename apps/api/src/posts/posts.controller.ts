import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ok, paginated } from '../common/response.util';
import {
  CountrySchema,
  PostDetailSchema,
  PostListItemSchema,
  PostListTranslationSchema,
  PostMediaSchema,
  PostTranslationSchema,
  apiPaginatedRes,
  apiRes,
} from '../common/swagger.schemas';
import { ListPostsQueryDto } from './dto/list-posts.dto';
import { PostsService } from './posts.service';
import type { Lang } from '@repo/types';

@ApiTags('posts')
@ApiExtraModels(
  CountrySchema,
  PostListTranslationSchema,
  PostTranslationSchema,
  PostMediaSchema,
  PostListItemSchema,
  PostDetailSchema,
)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'List published posts',
    description: 'Paginated list of published posts with a lean translation (title + excerpt) and country. Filter by country with `?country=KR`.',
  })
  @ApiQuery({ name: 'lang', enum: ['ko', 'en'], required: true })
  @ApiQuery({ name: 'country', required: false, description: 'ISO 3166-1 alpha-2 country filter' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiOkResponse(apiPaginatedRes({ $ref: getSchemaPath(PostListItemSchema) }))
  async findAll(@Query() query: ListPostsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { data, total } = await this.posts.listPublished(
      query.lang,
      page,
      limit,
      query.country,
    );
    return paginated(data, total, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post detail for one language' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiQuery({ name: 'lang', enum: ['ko', 'en'], required: true })
  @ApiOkResponse(apiRes({ $ref: getSchemaPath(PostDetailSchema) }))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang: Lang,
  ) {
    return ok(await this.posts.findOne(id, lang));
  }
}
