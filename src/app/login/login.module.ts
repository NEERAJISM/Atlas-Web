import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginDialogComponent } from './dialog/login-dialog.component';

import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  declarations: [
    LoginComponent,
    LoginDialogComponent,
  ],
  exports: [
    LoginComponent,
    LoginDialogComponent,
  ],
})
export class LoginModule {}
