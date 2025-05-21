import winston, { Logger } from 'winston';
import { ElasticsearchTransport, LogData } from 'winston-elasticsearch';

const esTransformer = (logData: LogData): any => {
  // Provide a custom transformer or use the default one if available
  return {
    '@timestamp': new Date().toISOString(),
    severity: logData.level,
    message: logData.message,
    fields: { ...logData.meta }
  };
}

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      apm: undefined, // or provide the appropriate APM configuration if needed
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
}