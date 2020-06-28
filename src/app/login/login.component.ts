import {
  Component,
  ViewChild,
  ElementRef,
  Inject,
  HostListener,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

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

  ngAfterViewInit() {
    // document.getElementById('splash').style.display = 'none';
    // document.getElementById('window').classList.add('window-animation');
  }

  onImageLoadComplete(){
    this.showContent = true;
  }

  scrollToElement(): void {
    const targetElement = this.examples.nativeElement;
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '250px',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.querySelector('.mask');
    let navbarElement = document.querySelector('.navbar');
    
    if (element && window.pageYOffset < element.clientHeight - navbarElement.clientHeight) {
      navbarElement.classList.remove('primary-color');
    } else {
      navbarElement.classList.add('primary-color');
    }
  }
}

// Dialog

@Component({
  selector: 'login-dialog',
  templateUrl: './login.component.dialog.html',
})
export class LoginDialog {
  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickLogin() {
    this.router.navigateByUrl('/dashboard');
    this.dialogRef.close();
  }
}
