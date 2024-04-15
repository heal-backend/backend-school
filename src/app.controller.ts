import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('chatroom')
  async getChatroom() {
    return this.appService.getChatroom();
  }
  
  @Post('chatroom')
  async createChatroom(
    @Body() { name }
  ) {
    return this.appService.createChatroom(name);
  }
  
  @Post('message')
  async createMessage(
    @Body() { chatroomId, content }
  ) {
    return this.appService.createMessage(chatroomId, content);
  }
}
