import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent {
  title = 'atlas-main';

  model = {
    left: true,
    middle: false,
    right: false
  };
}
