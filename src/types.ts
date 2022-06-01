export type tagObject = {
  key: string;
  vStr: string;
};

export type logFieldObject = {
  key: string;
  vType: number;
  vStr: string;
};

export type logObject = {
  timestamp: number;
  fields: logFieldObject[];
};

export type spanObject = {
  spanId: number;
  parentSpanId: number;
  operationName: string;
  references: any[];
  startTime: number;
  duration: number;
  tags: tagObject[];
  logs: logObject[];
};
