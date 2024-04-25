import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

export interface Commodity{
  id?: number,
  name: string,
  description: string,
  price: number,
  imagePaths: string[],
  inventory: number,
  unit: string,
  imagePathsJson?: string
}

@Injectable({
  providedIn: 'root'
})
export class CommoditiesManagerService {

  constructor(
    private commonService: CommonService
  ) { }

  getCommodities(skip:number, limit:number = 10):Promise<Commodity[]>{
    return new Promise((resolve)=>{
      this.commonService.getWithToken(CommonService.baseUrl + `api/commoditiesManager/getCommodities?skip=${skip}&limit=${limit}`)?.then(res=>{
        resolve(res);
      })
    })
  }

  async uploadImage(imageBlob: Blob):Promise<{filePath: string}|undefined>{
    let formData = new FormData();
    formData.append("file",imageBlob);
    let res = await this.commonService.postWithToken(CommonService.baseUrl+"api/commoditiesManager/uploadImage", {body: formData})
    return res;
  }

  async addCommodity(commodity: Commodity):Promise<void|undefined>{
    let res = await this.commonService.postWithToken(CommonService.baseUrl+"api/commoditiesManager/addCommodity",{body: commodity})
    return res;
  }

  async checkCommodityName(name: string):Promise<any|undefined>{
    let res = await this.commonService.getWithToken(CommonService.baseUrl+"api/commoditiesManager/checkName",{params:{
      name: name
    }})
    return res;
  }

}
