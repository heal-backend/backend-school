import { Body, Controller, Get, Param, Post, Query, Req, Res, Session } from '@nestjs/common';
// import { AppService } from './app.service';
import axios from 'axios';
import {stringify} from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { createHash, createCipheriv, createHmac, createDecipheriv} from 'crypto';
import iconv from 'iconv-lite';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  clientId = "af394038-aa0b-41bb-ad96-00669e5d9698";
  clientSecret = "6620c480c13db6426b09d72f5616c074";

  @Get()
  getHello1(@Session() session) {

    console.log("hello")
    console.log("hello")
    console.log(session)
    console.log("hello")
  }

  @Get('auth/nice')
  async getSite(@Session() session) {
    // try {
      const accessToken = await this.#getAccessToken();
      
      const now = new Date();
      const currentTimestamp = Math.floor(now.getTime()/1000);
      const authorization = Buffer.from(`${accessToken}:${currentTimestamp}:${this.clientId}`).toString('base64');
      const productId = 2101979031;
      
      const niceAuthHandler = new NiceAuthHandler(this.clientId, accessToken, productId);

      const reqDtim = this.getReqDtim(now);
      const reqNo = uuidv4().substring(0, 30);
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
                'req_dtim': reqDtim,
                "req_no": reqNo,
                "enc_mode": "1"
              }
            }
        });
        
        const token = response.data;
      
        console.log("token")
        console.log(token)
        
          const siteCode= response.data.dataBody.site_code;
          const tokenVal= response.data.dataBody.token_val;
          const tokenVersionId=  response.data.dataBody.token_version_id

        const { key, iv, hmacKey } = niceAuthHandler.generateSymmetricKey(reqDtim, reqNo, tokenVal);

        session.nice_key = {
          key: key,
          iv: iv,
        }
        
        const requestno = reqNo;    // 서비스 요청 고유 번호(*)   
        const returnurl = "http://13.209.188.108:4001/nice-callback";   // 인증결과를 받을 url(*)   
        const sitecode = siteCode;  // 암호화토큰요청 API 응답 site_code(*)    
        const authtype = '';    // 인증수단 고정(M:휴대폰인증,C:카드본인확인인증,X:인증서인증,U:공동인증서인증,F:금융인증서인증,S:PASS인증서인증)
        const mobileco = '';    // 이통사 우선 선택 
        const bussinessno = ''; // 사업자번호(법인인증인증에 한함)
        const methodtype = 'get';   // 결과 url 전달 시 http method 타입
        const popupyn = 'Y';    // 
        const receivedata = ''; // 인증 후 전달받을 데이터 세팅 

        const reqData = ({
            'requestno': requestno,
            'returnurl': returnurl,
            'sitecode': sitecode,
            'authtype': authtype,
            'methodtype': methodtype,
            'popupyn': popupyn,
            'receivedata': receivedata
        });
        
        const encData = niceAuthHandler.encryptData(reqData, key, iv);

        const integrityValue = niceAuthHandler.hmac256(encData, hmacKey);
    
       return {
          'tokenVersionId': tokenVersionId,
          'encData': encData,
          'integrityValue': integrityValue
      }
      } catch (e) {
        console.log("e")
        console.log(e)
        console.log("e")
      }
  }

  @Get('nice-callback')
  async returnCallback(
    @Query() query,
    @Body() body,
    @Param() param,
    @Session() session
  ) {
    console.log("query")
    console.log(query)
    console.log("body")
    console.log(body)
    console.log("param")
    console.log(param)
    try {
      const niceAuthHandler = new NiceAuthHandler();
      
      // 세션에 저장된 대칭키 
      const { key, iv } = session.nice_key;
      const encData = query.enc_data;

      const decData = niceAuthHandler.decryptData(encData, key, iv);
      console.log("decData")
      console.log(decData)
      return decData
      // res.redirect(301, 'http:locahost:3000/nice_success');
  } catch (error) {
      // res.status(500).json({ error: error.toString() })
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
  constructor(clientId?, accessToken?, productId?) {
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


generateSymmetricKey(reqDtim, reqNo, tokenVal) {
  try {
      if (!reqDtim || !reqNo || !tokenVal) {
          throw new Error('Empty parameter');
      }

      const value = reqDtim.trim() + reqNo.trim() + tokenVal.trim();

      // SHA256 암호화 후 Base64 encoding
      const hash = createHash('sha256').update(value).digest('base64');

      return {
          'key': hash.slice(0, 16),	// 앞에서부터 16byte
          'iv': hash.slice(-16),	// 뒤에서부터 16byte
          'hmacKey': hash.slice(0, 32) // 앞에서부터 32byte
      }
  } catch (error) {
      throw new Error('Failed to generate symmetric key');
  }
}

encryptData(data, key, iv) {
  try {
      if (!data || !key || !iv) {
          throw new Error('Empty parameter');
      }

      const strData = JSON.stringify(data).trim();

      // AES128/CBC/PKCS7 암호화         
      const cipher = createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv));
      let encrypted = cipher.update(strData, 'utf-8', 'base64');
      encrypted += cipher.final('base64');

      return encrypted;
  } catch (error) {
      throw new Error('Failed to encrypt data');
  }
}
hmac256(data, hmacKey) {
  try {
      if (!data || !hmacKey) {
          throw new Error('Empty parameter');
      }

      const hmac = createHmac('sha256', Buffer.from(hmacKey));
      hmac.update(Buffer.from(data));

      const integrityValue = hmac.digest().toString('base64');

      return integrityValue;
  } catch (error) {
      throw new Error('Failed to generate HMACSHA256 encrypt');
  }
}

decryptData(data, key, iv) {
    try {
        if (!data || !key || !iv) {
            throw new Error('Empty parameter');
        }

        const decipher = createDecipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(iv));
        let decrypted = decipher.update(data, 'base64', 'binary');
        decrypted += decipher.final('binary');

        // 'binary'에서 'euc-kr'로 디코딩
        decrypted = iconv.decode(Buffer.from(decrypted, 'binary'), 'euc-kr');

        const resData = JSON.parse(decrypted);
        return resData;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to decrypt data');
    }
}
}