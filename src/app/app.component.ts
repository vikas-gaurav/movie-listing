import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public isUserLoggedIn = false;
  public isDarkTheme = false;
  constructor(private _appService : AppService){
    console.log(`AppComponent :: construtor :: initializing...`)
  }
  public ngOnInit(){
    this._appService.currentTheme$.subscribe(theme_ => this.isDarkTheme = theme_ === 'dark');
    this._appService.isUserLoggedIn$.subscribe(val_ => {
      console.log(`AppComponent :: onInit :: userLoggedIn : ${val_}`)
      this.isUserLoggedIn = val_
    } );
  }

  public toggleTheme(){
    this._appService.currentTheme$.next(this.isDarkTheme? 'light': 'dark');
  }

  public doLogout(){
    console.log(`AppComponent :: doLogout :: Entering...`);
    this._appService.logoutUser();
  } 
}
