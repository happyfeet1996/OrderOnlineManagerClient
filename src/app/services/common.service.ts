import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient,
    private route: Router,
    private toastController: ToastController
  ) { }

  // public static readonly baseUrl = "http://192.168.0.105:5000/";
  public static readonly baseUrl = "http://47.113.188.82:5000/";

  public getWithToken(url:string,options?:any):Promise<any>|undefined{
    if(!options)
      options = {};
    let header = new Headers();
    let token = localStorage.getItem("token");
    if(!token){
      this.route.navigate(["/login"]);
      return undefined;
    }
    header.append("Authorization", "Bearer " + token);
    header.append("Access-Control-Allow-Origin","*");
    header.append('Access-Control-Allow-Credentials',"true")
    return new Promise((resolve)=>{
      options.headers = header;
      this.http.get(url,options).subscribe({
        next: (res:any)=>{resolve(res)},
        error: (err:HttpErrorResponse)=>{
          if(err.status === 401){
            let refreshToken = localStorage.getItem("refresh-token");
            if(!refreshToken){
              this.route.navigate(["/login"]);
              return;
            }
            if(!token){
              this.route.navigate(["/login"]);
              return undefined;
            }
            this.refreshToken(token, refreshToken).then(res=>{
              if(!res){
                return undefined;
              }
              let header2 = new Headers();
              localStorage.setItem("token",res.token);
              localStorage.setItem("refresh-token",res.refreshToken);
              header2.append("Authorization", "Bearer " + res.token);
              header.append("Access-Control-Allow-Origin","*");
              header.append('Access-Control-Allow-Credentials',"true")
              options.headers = header2;
              this.http.get(url, options).subscribe({
                next: (res:any)=>{resolve(res)},
                error: (err: HttpErrorResponse)=>{throw new Error(err.message)}
              })
            })
          }
        }
      })
    })
  }

  public postWithToken(url:string,options:any = {}):Promise<any>|undefined{
    let header = new Headers();
    let token = localStorage.getItem("token");
    if(!token){
      this.route.navigate(["/login"]);
      return undefined;
    }
    header.append("Authorization", "Bearer " + token);
    header.append("Access-Control-Allow-Origin","*");
    header.append('Access-Control-Allow-Credentials',"true")
    options.headers = header;
    return new Promise((resolve)=>{
      this.http.request('post',url,options).subscribe({
        next: (res:any)=>{resolve(res)},
        error: (err: HttpErrorResponse)=>{
          if(err.status == 401){
            let refreshToken = localStorage.getItem("refresh-token");
            if(!refreshToken){
              this.route.navigate(["/login"]);
              return;
            }
            if(!token){
              this.route.navigate(["/login"]);
              return undefined;
            }
            this.refreshToken(token, refreshToken).then(res=>{
              if(!res){
                return undefined;
              }
              let header2 = new Headers();
              localStorage.setItem("token",res.token);
              localStorage.setItem("refresh-token",res.refreshToken);
              header2.append("Authorization", "Bearer " + res.token);
              header.append("Access-Control-Allow-Origin","*");
              header.append('Access-Control-Allow-Credentials',"true")
              options.headers = header2;
              this.http.request("post", url, options).subscribe({
                next: (res:any)=>{resolve(res)},
                error: (err: HttpErrorResponse)=>{throw new Error(err.message)}
              })
            })
          }
        }
      })
    })
  }


  refreshToken(oldToken: string, refreshToken: string):Promise<{token:string,refreshToken:string}|undefined>{
    return new Promise((resolve)=>{
      this.http.get(CommonService.baseUrl+"api/oauth/refreshAdminToken",{
        params:{
          oldToken: oldToken,
          refreshToken: refreshToken
        }
      }).subscribe({
        next: (res:any)=>{
          localStorage.setItem("token",res.token);
          localStorage.setItem("refresh-token",res.refreshToken);
          resolve(res)
        },
        error: (err: HttpErrorResponse)=>{
          this.toastController.create({
            header: "请求错误",
            message: err.status + err.message,
            duration: 3000,
            position: "top"
          }).then((toast)=>{
            toast.present();
            resolve(undefined)
          })
        }
      })
    })
  }

  public static generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  public static getTokenHeader(){
    let token = localStorage.getItem("token");
    let header = new Headers();
    if(token)
      header.append("Authorization",token);
    return header;
  }

}
