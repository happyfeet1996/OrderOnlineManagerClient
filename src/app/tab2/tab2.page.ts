import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrl: "./tab2.page.less"
})
export class Tab2Page {

  addProductsComponent = AddProductComponent;

  @ViewChild("productsList")
  productsList!: ProductsListComponent;

  constructor(
    private route: Router
  ) {}

  gotoAdd(){
    this.route.navigate(["/tabs/tab2/addProduct"])
  }

  ionViewDidEnter(){
    this.productsList?.ngOnInit();
  }

}
