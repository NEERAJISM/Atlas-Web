import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileComponent } from './profile.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatBadgeModule,
    MatStepperModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTabsModule,
    MatRadioModule,
  ],
  declarations: [ProfileComponent],
  exports: [ProfileComponent],
})
export class ProfileModule {}
