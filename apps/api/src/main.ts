import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import type { INestApplication } from '@nestjs/common';

let app: INestApplication | undefined;

async function createApp(): Promise<INestApplication> {
  if (app) return app;

  app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Travel Blog API')
    .setDescription('REST API for the travel blog — public reads & admin CUD')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'supabase-jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return app;
}

// Vercel serverless handler
export default async function handler(req: unknown, res: unknown) {
  const nestApp = await createApp();
  const server = nestApp.getHttpAdapter().getInstance() as (req: unknown, res: unknown) => void;
  server(req, res);
}

// Local dev — only runs when executed directly (not imported by Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.IS_LOCAL === 'true') {
  createApp().then((nestApp) => nestApp.listen(process.env.PORT ?? 4000));
}
