import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PrismaService } from './prisma/prisma.service';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    SessionModule.forRoot({
      session: { secret: 'keyboard cat' },
    }),
  ],
  controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
