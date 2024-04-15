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
  
  async createChatroom(name) {
    const prismaClient = new PrismaService();

    const chatrooms = await prismaClient.chatroom.create({
      data: {
        name: name
      }
    });
    return chatrooms;
  }
  
  async createMessage(chatroomId, content) {
    const prismaClient = new PrismaService();

    const chatrooms = await prismaClient.message.create({
      data: {
        content: content,
        chatroomId: chatroomId
      }
    });
    return chatrooms;
  }
  
  async getMessages(chatroomId) {
    const prismaClient = new PrismaService();

    const chatrooms = await prismaClient.message.findMany({
      where: {
        chatroomId: chatroomId
      }
    });
    return chatrooms;
  }
}
