import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
// import { AppService } from './app.service';
import axios from 'axios';
import {stringify} from 'qs';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  clientId = "af394038-aa0b-41bb-ad96-00669e5d9698";
  clientSecret = "6620c480c13db6426b09d72f5616c074";

  @Get()
  getHello1() {
    console.log("hello")
    console.log("hello")
    console.log("hello")
  }

  @Get('auth/nice')
  async getSite() {
    // try {
      const accessToken = await this.#getAccessToken();
      console.log("accessToken")
      console.log(accessToken)
      const now = new Date();
      const currentTimestamp = now.getTime()/1000;
      console.log(`${accessToken}:${currentTimestamp}:${this.clientId}`)
      console.log(`${accessToken}:${currentTimestamp}:${this.clientId}`)
      console.log(`${accessToken}:${currentTimestamp}:${this.clientId}`)
      const authorization = Buffer.from(`${accessToken}:${currentTimestamp}:${this.clientId}`).toString('base64');
      const productId = 2101979031;

      try {
        const response = await axios({
            method: 'POST',
            url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${authorization}`,  
                "client_id": this.clientId,
                "productID": productId
            },
            data: {
              'dataHeader': {
                "CNTY_CD": "ko",
              },
              'dataBody': {
                'req_dtim': this.getReqDtim(now),
                "req_no": uuidv4().substring(0, 30),
                "enc_mode": "1"
              }
            }
        });
        
        const token = response.data;
      
        console.log("crypto")
        console.log("crypto")
        console.log(token)
        console.log("crypto")
        console.log("crypto")
    
      } catch (e) {
        console.log("e")
        console.log("e")
        console.log(e)
        console.log("e")
        console.log("e")
      }
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
  
      try {
        const response = await axios({
            method: 'POST',
            url: 'https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Basic ${authorization}`
            },
            data: stringify(dataBody)
        });
        // const token = response.data;
        const token = response.data.dataBody.access_token;
        console.log("token")
        console.log("token")
        console.log(token)
        console.log("token")
        console.log("token")
      } catch (e) {
        console.log("e")
        console.log("e")
        console.log(e)
        console.log("e")
        console.log("e")
      }
      

  }

  getReqDtim(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDateTime;
}
  
  @Post('crypted-token')
  async getCryptedToken(@Body() body) {
    console.log(body.accessToken)
    const clientId = "af394038-aa0b-41bb-ad96-00669e5d9698";
    const now = new Date();
    const currentTimestamp = Math.floor(now.getTime()/1000);
    console.log(`${body.accessToken}:${currentTimestamp}:${clientId}`)
    console.log(`${body.accessToken}:${currentTimestamp}:${clientId}`)
    console.log(`${body.accessToken}:${currentTimestamp}:${clientId}`)
      const authorization = Buffer.from(`${body.accessToken}:${currentTimestamp}:${clientId}`).toString('base64');
    const productId = 2101979031;

  try {
    const response = await axios({
        method: 'POST',
        url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${authorization}`,  
            "client_id": clientId,
            "productID": productId
        },
        data: {
          'dataHeader': {
            "CNTY_CD": "ko",
          },
          'dataBody': {
            'req_dtim': this.getReqDtim(now),
            "req_no": uuidv4().substring(0, 30),
            "enc_mode": "1"
          }
        }
    });
    
    const token = response.data;
  
    console.log("crypto")
    console.log("crypto")
    console.log(token)
    console.log("crypto")
    console.log("crypto")

  } catch (e) {
    console.log("e")
    console.log("e")
    console.log(e)
    console.log("e")
    console.log("e")
  }
  }

  @Post('auth/signup')
  async signup(
    @Body() { username, password },
    @Res() res
  ) {
    if (!username || !password) {
      return res.status(400).json({message: "input username, password necesarry"})
    }
    // const result =  await this.appService.signup(username, password);
    // if (result === 'username already exists') {
    //   return res.status(400).json({message: "username already exists"})
    // }

    return res.status(200).json();
  }
    

  async #getAccessToken() {
    
    const authorization = Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');

    const dataBody = {
        'scope': 'default',
        'grant_type': 'client_credentials'
    };

    const response = await axios({
        method: 'POST',
        url: 'https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authorization}`
        },
        data: stringify(dataBody)
    });

    console.log("response.data.dataBody.access_token")
    console.log("response.data.dataBody.access_token")
    console.log(response.data.dataBody.access_token)
    console.log(response.data)
    console.log("response.data.dataBody.access_token")
    console.log("response.data.dataBody.access_token")

    const token = response.data.dataBody.access_token;
    return token
  };
  
}




class NiceAuthHandler {
  clientId: any;
  accessToken: any;
  productId: any;
  constructor(clientId, accessToken, productId) {
      this.clientId = clientId;
      this.accessToken = accessToken;
      this.productId = productId;
  }

  // 날짜 데이터 형변환(YYYYMMDDHH24MISS)
  formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
      return formattedDateTime;
  }

  async getEncryptionToken(reqDtim, currentTimestamp, reqNo) {
      try {
          const authorization = Buffer.from(this.accessToken + ':' + currentTimestamp + ':' + this.clientId).toString('base64');

          const response = await axios({
              method: 'POST',
              url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `bearer ${authorization}`,
                  'client_id': this.clientId,
                  'productID': this.productId,
              },
              data: {
                  'dataHeader': {
                      'CNTY_CD': 'ko' // 이용언어 : ko, en, cn
                  },
                  'dataBody': {
                      'req_dtim': reqDtim,    // 요청일시
                      'req_no': reqNo,    // 요청고유번호
                      'enc_mode': '1' // 사용할 암복호화 구분 1 : AES128/CBC/PKCS7
                  }
              }
          });

          const resData = response.data;
          
          // P000 성공, 이외 모두 오류 
          if (resData.dataHeader.GW_RSLT_CD !== '1200' && resData.dataBody.rsp_cd !== 'P000') {
              throw new Error('Failed to request crypto token');
          }
          
          // 사이트 코드, 서버 토큰 값, 서버 토큰 버전 반환 
          return {
              'siteCode': resData.dataBody.site_code,
              'tokenVal': resData.dataBody.token_val,
              'tokenVersionId': resData.dataBody.token_version_id
          }

      } catch (error) {
          throw new Error('Failed to get encryption token');
      }
  }
}