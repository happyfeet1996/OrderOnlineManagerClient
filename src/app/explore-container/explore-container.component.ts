import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html'
})
export class ExploreContainerComponent {

  @Input() name?: string;

}
