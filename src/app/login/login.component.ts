import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public invalidcredentials= false;
  public isDarkTheme = false;
  public errorMessage?: string;
  public processing = false;
  constructor(private appService: AppService) {
    console.log(`LoginComponent :: constructor ::constructor initialized`);
    this.appService.currentTheme$.subscribe(theme_ => this.isDarkTheme = theme_ === 'dark');
    this.appService.loginError$.subscribe(message_ => this.errorMessage = message_);
  }

  ngOnInit() {
    this.appService.isUserLoggedIn$.subscribe(login_ => this.processing = !login_);
  }

  public onEnter(event_: any,email: string, pwd: string){
    if(event_.keyCode === 13){
      this.processing = true;
      this.authenticate(email, pwd);
    }
  }

  public authenticate(email: string, pwd: string){
    this.processing = true;
    this.appService.authenticateUser(email, pwd);
  }

  public closeErrorMessage(){
    this.errorMessage = undefined;
  }

}
