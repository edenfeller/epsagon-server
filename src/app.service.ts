import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { queryBody } from './queryParams.dto';
import { spanObject } from './types';

@Injectable()
export class AppService {
  async getAll(): Promise<spanObject[]> {
    const data = await fs.readFile('./src/SPANS.json', 'utf8');
    const jsonData = JSON.parse(data) as spanObject[];
    return jsonData;
  }

  handleString = (
    queryParams: queryBody,
    jsonData: spanObject[],
  ): spanObject[] => {
    const { key, query, params } = queryParams;
    let value: spanObject[];
    switch (query) {
      case 'equals':
        value = jsonData.filter((data) => data[key] === params);
        break;
      case 'includes':
        value = jsonData.filter((data) => data[key].includes(params));
        break;
      case 'startsWith':
        value = jsonData.filter((data) => data[key].startsWith(params));
        break;
      case 'endsWith':
        value = jsonData.filter((data) => data[key].endsWith(params));
        break;
      default:
        value = [];
    }
    return value;
  };

  handleInt = (
    queryParams: queryBody,
    jsonData: spanObject[],
  ): spanObject[] => {
    const { key, query, params } = queryParams;
    const intParam = parseInt(params);
    let value: spanObject[];
    switch (query) {
      case 'equals':
        value = jsonData.filter((data) => data[key] === intParam);
        break;
      case 'above':
        value = jsonData.filter((data) => data[key] > intParam);
        break;
      case 'less':
        value = jsonData.filter((data) => data[key] < intParam);
        break;
      default:
        value = [];
    }
    return value;
  };

  handleTags = (
    queryParams: queryBody,
    jsonData: spanObject[],
  ): spanObject[] => {
    const { tagKey, query, params } = queryParams;
    let value = [];
    switch (query) {
      case 'equals':
        value = jsonData.filter((data) =>
          data.tags.some((tag) => tag.key === tagKey && tag.vStr === params),
        );
        break;
      default:
        value = [];
    }
    return value;
  };

  handleLogs = (
    queryParams: queryBody,
    jsonData: spanObject[],
  ): spanObject[] => {
    const { logField, logFieldKey, query, params } = queryParams;
    let value = [];
    if (logField === 'timestamp') {
      switch (query) {
        case 'equals':
          value = jsonData.filter((data) =>
            data.logs.some((log) => log.timestamp === parseInt(params)),
          );
          break;
        case 'above':
          value = jsonData.filter((data) =>
            data.logs.some((log) => log.timestamp > parseInt(params)),
          );
          break;
        case 'less':
          value = jsonData.filter((data) =>
            data.logs.some((log) => log.timestamp < parseInt(params)),
          );
          break;
        default:
          value = [];
      }
      return value;
    }
    if (logField === 'fields') {
      switch (query) {
        case 'equals':
          value = jsonData.filter((data) =>
            data.logs.some((log) =>
              log.fields.some(
                (field) => field.key === logFieldKey && field.vStr === params,
              ),
            ),
          );
          break;
        case 'includes':
          value = jsonData.filter((data) =>
            data.logs.some((log) =>
              log.fields.some(
                (field) =>
                  field.key === logFieldKey && field.vStr.includes(params),
              ),
            ),
          );
          break;
        case 'startsWith':
          value = jsonData.filter((data) =>
            data.logs.some((log) =>
              log.fields.some(
                (field) =>
                  field.key === logFieldKey && field.vStr.startsWith(params),
              ),
            ),
          );
          break;
        case 'endsWith':
          value = jsonData.filter((data) =>
            data.logs.some((log) =>
              log.fields.some(
                (field) =>
                  field.key === logFieldKey && field.vStr.endsWith(params),
              ),
            ),
          );
          break;
        default:
          value = [];
      }
      return jsonData.filter((data) =>
        data.logs.some((log) =>
          log.fields.some(
            (field) => field.key === logFieldKey && field.vStr === params,
          ),
        ),
      );
    }
    return [];
  };

  handleOneQuery = (
    queryParams: queryBody,
    jsonData: spanObject[],
  ): spanObject[] => {
    const { key, query, params } = queryParams;
    Logger.debug(`Executing one query: ${key} ${query} ${params}`);
    if (key === 'operationName') {
      return this.handleString(queryParams, jsonData);
    }
    if (
      key === 'spanId' ||
      key === 'parentSpanId' ||
      key === 'startTime' ||
      key === 'duration'
    ) {
      return this.handleInt(queryParams, jsonData);
    }
    if (key === 'tag') {
      return this.handleTags(queryParams, jsonData);
    }
    if (key === 'log') {
      return this.handleLogs(queryParams, jsonData);
    }
    return [];
  };

  async executeQuery(
    queryParams: queryBody[],
    type: string,
  ): Promise<spanObject[]> {
    if (
      !queryParams ||
      !queryParams['querysList'] ||
      queryParams['querysList'].length === 0
    )
      return [];
    const data = await fs.readFile('./src/SPANS.json', 'utf8');
    let jsonData = JSON.parse(data) as spanObject[];
    let result: spanObject[];
    switch (type) {
      case 'and':
        queryParams['querysList'].forEach((query) => {
          result = this.handleOneQuery(query, jsonData);
          jsonData = result;
        });
        break;
      default:
        jsonData = [];
    }
    return jsonData;
  }
}
