import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION } from './constants';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(MONGO_CONNECTION),
  ],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule { 
}
