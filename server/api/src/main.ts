import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as fs from 'fs';
 
//var csurf = require('csurf');
async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  let httpsOptions = null;

  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const port = Number(process.env.PORT) || 3000;
  app.use(cors());
  app.use(helmet());
  // app.use(csurf());

  await app.listen(port);
}

bootstrap();
