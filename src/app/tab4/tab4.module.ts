import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab4PageRoutingModule } from './tab4-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab4Page } from './tab4.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule({
  declarations: [Tab4Page],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    Tab4PageRoutingModule,
    ExploreContainerComponentModule
  ]
})
export class Tab4PageModule { }
