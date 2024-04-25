import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  implements OnInit {

  captchaSrc: string = "";

  userName!: string;
  password!: string;
  captcha!: string;
  private captchaId: string = "";

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private route: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
    let token = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refresh-token");
    if(token && refreshToken){
      this.commonService.refreshToken(token,refreshToken).then(res=>{
        if(res){
          this.route.navigate(["/tabs"]);
        }else{
          this.generateCaptcha();
        }
      })
    }else
      this.generateCaptcha();
  }

  generateCaptcha(){
    this.captchaId = CommonService.generateUUID();
    this.authService.getLoginCaptcha(this.captchaId, 40, 20, 4).then(res=>{
      this.captchaSrc = res;
    })
  }

  async signin(){
    if((!this.userName)||(!this.captchaId)||(!this.password)||(!this.captcha)){
      const toast = await this.toastController.create({
        header: "错误",
        message: "确保填写信息！",
        duration: 3000,
        position: "top"
      })
      await toast.present();
      return;
    }
    this.authService.signIn(this.userName,this.captchaId,this.password,this.captcha).then(async res=>{
      if(res.success){
        localStorage.setItem("token",res.token);
        localStorage.setItem("refresh-token",res.refreshToken);
        this.userName = this.captchaId = this.password = this.captcha = "";
        this.route.navigate(["/tabs"]);
      }else{
        const toast = await this.toastController.create({
          header: "登录失败",
          message: "确保用户名密码正确！",
          duration: 3000,
          position: "top"
        })
        await toast.present();
      }
    })
  }

  gotoSignUp(){
    this.route.navigate(["/login/signup"]);
  }

}
