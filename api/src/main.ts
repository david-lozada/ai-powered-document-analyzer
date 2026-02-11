import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
declare const module: {
  hot: { accept: () => void; dispose: (callback: () => void) => void };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.FRONTEND_URL);
  // Enable CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL].filter((url) => !!url),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set global prefix for routes
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close().catch((err) => {
        console.error('Error during app close:', err);
      });
    });
  }
}
bootstrap();
