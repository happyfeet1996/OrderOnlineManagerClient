import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { CommoditiesManagerService, Commodity } from 'src/app/services/commodities-manager.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less'],
})
export class AddProductComponent  implements OnInit {

  // images: any[] = [];
  actionSheetButtons = [
    {
      text: '从相册选择',
      data: {
        action: 'photo',
      },
    },
    {
      text: '拍照',
      data: {
        action: 'camera',
      },
    },
    {
      text: '取消',
      data: {
        action: 'cancel',
      },
    },
  ];
  imagesWebPath: string[] = [];
  isActionSheetOpen: boolean = false;
  productName: string|undefined;
  productPrice: number|undefined;
  productUnit: string|undefined;
  productInventory: number|undefined;
  productDes: string = "";

  constructor(
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public commoditiesManger: CommoditiesManagerService,
    public router: Router
  ) { }

  ngOnInit() {}

  ionViewWillLeave(){
    console.log("add product leave")
  }

  private async takephoto(){
    let image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      allowEditing: false,
      width: 1080,
      height: 1080
    });
    if(image.webPath)
      this.imagesWebPath.push(image.webPath);
  }

  private async pickImages(){
    let images = await Camera.pickImages({
      width: 1080,
      height:1080
    });
    images.photos.forEach(photo=>{
      this.imagesWebPath.push(photo.webPath);
    })
  }

  handleAddActions(event:any){
    this.isActionSheetOpen = false;
    if((event.detail.data===undefined)||(event.detail.data.action === "cancel"))
      return;
    else if(event.detail.data.action === "camera")
      this.takephoto();
    else
      this.pickImages();
  }

  getRowCount():number[]{
    return new Array(Math.ceil(this.imagesWebPath.length / 3));
  }

  removeImage(path:string){
    this.imagesWebPath = this.imagesWebPath.filter(p=>p!==path);
  }

  async submit(){
    if(!this.productName||!this.productPrice||!this.productUnit||(this.productInventory===undefined)){
      const alert = await this.alertController.create({
        header: '必填项未填写',
        message: '非可选填写项必须填写完整',
        buttons: ['确定'],
      });
      await alert.present();
      return;
    }
    let checked = await this.commoditiesManger.checkCommodityName(this.productName);
    if(checked){
      const sameAlert = await this.alertController.create({
        header: '警告',
        message: `已存在"${this.productName}",是否重复添加？`,
        buttons: [{
          text: "取消",
          role: "cancel"
        },{
          text: "继续",
          role: "ok"
        }],
      });
      await sameAlert.present();
      let event = await sameAlert.onDidDismiss();
      if(event.role === "cancel")
        return;
    }
    let fileUploadSuccess: boolean = true;
    let filePaths: string[] = [];
    const imagesUploading = await this.loadingCtrl.create({
      message: '上传图片中...'
    });
    imagesUploading.present();
    await Promise.all(this.imagesWebPath.map(async path=>{
      let blob = await fetch(path).then(response=>response.blob());
      let filePath = await this.commoditiesManger.uploadImage(blob);
      if(filePath)
        filePaths.push(filePath.filePath);
      else
        fileUploadSuccess = false;
    }))
    imagesUploading.dismiss();
    const productUploading = await this.loadingCtrl.create({
      message: '数据保存中...'
    });
    productUploading.present();
    let commodity: Commodity = {
      name: this.productName,
      price: this.productPrice,
      unit: this.productUnit,
      imagePaths: filePaths,
      inventory: this.productInventory,
      description: this.productDes
    }
    let res = await this.commoditiesManger.addCommodity(commodity);
    productUploading.dismiss();
    if(res === undefined){
      const alert = await this.alertController.create({
        header: '失败',
        message: '数据保存失败，请重新尝试！',
        buttons: ['确定'],
      });
      await alert.present();
    }else{
      const alert = await this.alertController.create({
        header: '成功',
        message: `数据保存成功${fileUploadSuccess?"":",图片部分丢失，可在编辑界面重新上传"}`,
        buttons: ['确定'],
      });
      await alert.present();
      await alert.onWillDismiss();
    }
    const continueAlert = await this.alertController.create({
      header: '提示',
      message: `是否继续添加？`,
      buttons: [{
        text: "取消",
        role: "cancel"
      },{
        text: "继续",
        role: "ok"
      }],
    });
    await continueAlert.present();
    let event = await continueAlert.onDidDismiss();
    if(event.role === "cancel")
      this.router.navigate(["/tabs/tab2/home"]);
    else{
      this.productName = this.productUnit = this.productInventory = this.productPrice = undefined;
      this.productDes = "";
      this.imagesWebPath = [];
    }
  }

}
