import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main.component';

@NgModule({
  imports: [NgbModule, FormsModule],
  declarations: [MainComponent],
  exports: [MainComponent],
})
export class MainModule {}
