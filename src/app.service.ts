import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  async signup(username, password) {
    const prismaClient = new PrismaService();
    try {
      return await prismaClient.user.create({
        data: {
          username,
          password
        }
      })
    } catch (err) {
      if (err.code == 'P2002') return 'username already exists'
    }
  }
  
  async signin(username, password) {
    const prismaClient = new PrismaService();
      const user = await prismaClient.user.findFirst({
        where: {
          username
        }
      })
        console.log(user)
        console.log(user)
        console.log(user)
      if (!user) return "non existing user";

      if (user.password !== password) {
        return "wrong password"
      }

      return user
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
      },
      // sort
      orderBy: {
        createdAt: 'desc'
      }
    });
    return chatrooms;
  }
}
