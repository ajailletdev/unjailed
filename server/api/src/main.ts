import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as history from 'connect-history-api-fallback';
 
//var csurf = require('csurf');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(helmet());
  app.use(history());
  // app.use(csurf());

  await app.listen(3000);
}
bootstrap();
