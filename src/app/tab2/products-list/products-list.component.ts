import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CommoditiesManagerService, Commodity } from 'src/app/services/commodities-manager.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent  implements OnInit {

  commodities: Commodity[] = []

  state = {
    refreshState: {
      currentState: 'finish',
      drag: false
    },
    endReachedRefresh: false
  };
  hasMore: boolean = true;

  constructor(
    private commoditiesManagerService: CommoditiesManagerService,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: '加载中...'
    });
    loading.present();
    await this.getProducts(0,10);
    loading.dismiss();
  }

  async getProducts(skip:number,limit:number){
    await this.commoditiesManagerService.getCommodities(skip,limit).then(res=>{
      this.commodities = res;
    })
  }

  getRowCount():number[]{
    return new Array(Math.ceil(this.commodities.length / 2));
  }

  async pullToRefresh(event:any){
    if(!this.hasMore)
      return;
    this.hasMore = false;
    await this.commoditiesManagerService.getCommodities(this.commodities.length, 10).then(res=>{
      if(res.length===0){
        this.hasMore = false;
      }else{
        this.commodities.push(...res);
        this.hasMore = true;
      }
    })
  }

}
