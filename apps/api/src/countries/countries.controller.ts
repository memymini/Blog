import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ok } from '../common/response.util';
import { CountrySchema, apiRes } from '../common/swagger.schemas';
import { CountriesService } from './countries.service';

@ApiTags('countries')
@ApiExtraModels(CountrySchema)
@Controller('countries')
export class CountriesController {
  constructor(private readonly countries: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all countries', description: 'Returns all countries ordered by name. Used by the admin UI to populate the country selector when creating posts.' })
  @ApiOkResponse(apiRes({ type: 'array', items: { $ref: getSchemaPath(CountrySchema) } }))
  async findAll() {
    return ok(await this.countries.findAll());
  }
}
