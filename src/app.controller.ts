import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { queryParamsDto } from './queryParams.dto';

export enum QuerysType {
  And = 'and',
  Or = 'or',
}

@Controller('/data')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getResult2() {
    Logger.debug('Get Result was called');
    const result = await this.appService.getAll();
    return result;
  }

  @Post()
  @ApiQuery({ name: 'type', enum: QuerysType })
  async executeQuery(
    @Body()
    queryParams: queryParamsDto[],
    @Query('type') type: QuerysType,
  ) {
    Logger.debug(`Got execut query`);
    const result = await this.appService.executeQuery(
      queryParams,
      type ?? 'and',
    );
    return result;
  }
}
