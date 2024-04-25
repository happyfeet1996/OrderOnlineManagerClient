import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  getLoginCaptcha(phoneNumber:string,width:number,height:number,count:number = 4):Promise<string>{
    return new Promise((resolve,reject)=>{
      this.http.get(CommonService.baseUrl+"api/oauth/getManagerLoginCaptcha",{
        params:{
          captchaId: phoneNumber,
          width: width,
          height: height,
          count: count
        }
      }).subscribe({
        next: (res:any)=>{resolve(res.src)},
        error: (err: HttpErrorResponse)=>{
          this.toastController.create({
            header: "请求错误",
            message: err.status + err.message,
            duration: 3000,
            position: "top"
          }).then((toast)=>{
            toast.present();
          })
        }
      })
    })
  }

  signIn(userName: string, captchaId: string, password: string, captcha: string):Promise<any>{
    return new Promise((resolve)=>{
      this.http.get(CommonService.baseUrl+"api/oauth/managerToken",{
        params:{
          userName: userName,
          captchaId: captchaId,
          password: password,
          captcha: captcha
        }
      }).subscribe({
        next: (res)=>{resolve(res)},
        error: (err: HttpErrorResponse)=>{
          this.toastController.create({
            header: "请求错误",
            message: err.status + err.message,
            duration: 3000,
            position: "top"
          }).then((toast)=>{
            toast.present();
          })
        }
      })
    })
  }


}
