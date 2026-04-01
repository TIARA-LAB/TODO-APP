import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // ← ADD
import { PrismaModule } from './prisma/prisma.module';  // ← ADD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,  // ← Makes ConfigService available everywhere
      envFilePath: '.env',
    }),
    PrismaModule,  // ← Database service
    AuthModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}