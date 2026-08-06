import { IsString, IsUrl } from 'class-validator';

export class DeleteMediaFileDto {
  @IsString()
  @IsUrl({}, { message: 'url must be a valid URL' })
  url: string;
}
