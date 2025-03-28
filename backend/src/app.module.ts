// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend'), // serve the frontend folder
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
