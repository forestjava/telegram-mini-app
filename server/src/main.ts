import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntSerializationInterceptor } from './common/interceptors/bigint-serialization.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.enableCors(); // TODO: add proper CORS configuration
  
  // BigInt → string для безопасной JSON сериализации
  app.useGlobalInterceptors(new BigIntSerializationInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
