import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  app.enableShutdownHooks();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  logger.log(`Server started on port: ${PORT}`);
}
bootstrap();
