import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import {stringify} from 'qs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('nice-test')
  async niceTest() {
      const clientId = "af394038-aa0b-41bb-ad96-00669e5d9698";
      const clientSecret = "6620c480c13db6426b09d72f5616c074";
      const authorization = Buffer.from(clientId + ':' + clientSecret).toString('base64');
  
      const dataBody = {
          'scope': 'default',
          'grant_type': 'client_credentials'
      };
  
      const response = await axios({
          method: 'POST',
          url: 'https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              'Authorization': `Basic ${authorization}`
          },
          data: stringify(dataBody)
      });
      
      const token = response.data;

      console.log("token")
      console.log("token")
      console.log(token)
      console.log("token")
      console.log("token")
  }

  @Post('auth/signup')
  async signup(
    @Body() { username, password },
    @Res() res
  ) {
    if (!username || !password) {
      return res.status(400).json({message: "input username, password necesarry"})
    }
    const result =  await this.appService.signup(username, password);
    if (result === 'username already exists') {
      return res.status(400).json({message: "username already exists"})
    }

    return res.status(200).json();
  }
  
  @Post('auth/signin')
  async signin(
    @Body() { username, password },
    @Res() res
  ) {
    if (!username || !password) {
      return res.status(400).json({message: "input username, password necesarry"})
    }
    const result = await this.appService.signin(username, password);
    if (result === "non existing user") return res.status(400).json({message: "non existing user"})
    if (result === "wrong password") return res.status(400).json({message: "wrong password"})
    console.log(result)
    console.log(result)
    console.log(result)
    return res.status(200).json()
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
  
  @Get('message')
  async getMessage(
    @Body() { chatroomId }
  ) {
    return this.appService.getMessages(chatroomId);
  }

  @Post('kakaopay/payment/ready')
  async tryKakaoPaymentReady(@Body() body) {
    try {
      const response = await axios.post('https://open-api.kakaopay.com/online/v1/payment/ready', body, {
        headers: {
          Authorization: "SECRET_KEY DEV057F63A391B978F98352FAC04D7F4C488A9B1",
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }
  
  
}
