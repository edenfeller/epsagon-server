import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { logObject } from './types';

export type queryBody = {
  key: string;

  query: string;

  params: any;

  tagKey?: string;

  logField?: keyof logObject;

  logFieldKey?: string;
};

export class queryParamsDto {
  @ApiProperty()
  key: string;

  @ApiPropertyOptional()
  tagKey?: string;

  @ApiProperty()
  query: string;

  @ApiProperty()
  params: any;
}
