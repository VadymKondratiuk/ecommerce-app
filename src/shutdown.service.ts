import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { AppDataSource } from './data-source';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(private readonly logger: Logger) {}

  async onApplicationShutdown(signal: string) {
    this.logger.log(
      `Signal received: ${signal}. Starting graceful shutdown...`,
    );

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      this.logger.log('Database connections closed.');
    }

    this.logger.log('Application finished safely.');
  }
}
