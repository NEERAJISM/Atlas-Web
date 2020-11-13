import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './dialog/login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  title = 'atlas-login';

  @ViewChild('examples')
  examples: ElementRef;

  showContent = false;

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {
    this.showContent = false;
  }

  onImageLoadComplete() {
    this.showContent = true;
  }

  scrollToElement(): void {
    const targetElement = this.examples.nativeElement;
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '300px',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.view');
    const navbarElement = document.querySelector('.navbar');

    if ( element && window.pageYOffset < element.clientHeight - navbarElement.clientHeight ) {
      navbarElement.classList.remove('bg-primary');
    } else {
      navbarElement.classList.add('bg-primary');
    }
  }
}
