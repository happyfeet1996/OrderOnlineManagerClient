import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CusRefresherComponent } from './cus-refresher/cus-refresher.component';



@NgModule({
  declarations: [
    CusRefresherComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ CusRefresherComponent ]
})
export class ShareModule { }
