import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: {
  hot: { accept: () => void; dispose: (callback: () => void) => void };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

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
