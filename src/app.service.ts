import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getChatroom() {
    const prismaClient = new PrismaService();

    const chatrooms = await prismaClient.chatroom.findMany();
    return chatrooms;
  }
}
