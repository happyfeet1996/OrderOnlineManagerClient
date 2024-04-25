import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  {
    path: 'home',
    component: Tab2Page
  },
  {
    path: 'addProduct',
    component: AddProductComponent
  },
  {
    path: "",
    pathMatch: 'full',
    redirectTo: "home"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
