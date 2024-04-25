import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PullToRefreshComponent } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'cus-refresher',
  templateUrl: './cus-refresher.component.html',
  styleUrls: ['./cus-refresher.component.less'],
})
export class CusRefresherComponent extends PullToRefreshComponent {

  @Input("canActive")
  canActive: boolean = true;

  @HostListener('touchstart', ['$event'])
  override touchstart(e) {
    if(!this.canActive)
      return;
    super.touchstart(e)
  }

  @HostListener('touchmove', ['$event'])
  override touchmove(e) {
    if(!this.canActive)
      return;
    super.touchmove(e);
  }

  @HostListener('touchend', ['$event'])
  override touchend(e) {
    if(!this.canActive)
      return;
    super.touchend(e);
  }

}
