  
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { BehaviorSubject } from 'rxjs';
import { IAuthResponse, IUser } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public currentTheme$: BehaviorSubject<string> = new BehaviorSubject<string>('light');
  public loginError$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  public isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  
  constructor(private http: HttpClient) {
    console.log(`AppService :: constructor ::constructor initialized`);
    if(localStorage.getItem('themePreference')){ 
      this.currentTheme$.next(localStorage.getItem('themePreference'));
    }
    this.currentTheme$.subscribe(theme_ => {
      this._setPreferredTheme(theme_);
    });

    if(!localStorage.getItem('loggedInUser')){
      this.isUserLoggedIn$.next(false);
    }
   }

  private movieAPI = "https://demo.credy.in/api/v1/maya/movies/";
  private authAPI = "https://demo.credy.in/api/v1/usermodule/login/";
  private authToken = "";
  //get all user
  public getMovies(pageNo_: number){
    const loggedInUser_ = JSON.parse(localStorage.getItem('loggedInUser'));
    if(loggedInUser_ && loggedInUser_.token){
      console.log(`AppService :: getMovies :: logged in user found`,loggedInUser_);
      return this.http.get(this.movieAPI + '?page=' + pageNo_,{headers: {'Authorization': 'Token '+ loggedInUser_.token}});
    }
  }

  //authenticate user by userId and password
  public authenticateUser(user_: string, pwd_: string) {
    console.log(`AppService :: authenticateUser :: authenticating user: ${user_} and password: ${pwd_}`);
    this.http.post(this.authAPI, { username: user_, password: pwd_ }, {})
    .subscribe((res_:IAuthResponse) => {
        console.log(`AppService :: authenticateUser :: API res`, res_);
        if(res_ && res_.is_success && res_.data && res_.data.token){
          this.authToken = res_.data.token;        
          const loggedInUser_: IUser = {
            name : user_,
            token : this.authToken
          }
          this.isUserLoggedIn$.next(true);
          localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser_));
          console.log(`AppService :: authenticateUser :: authToken`, this.authToken);
        }
        else if(res_ && !res_.is_success && res_.error){
          console.info(`AppService :: authentication error :: `,res_.error.message);
          this.loginError$.next(res_.error.message);
        }
    }, error=>{
      console.info(`AppService :: error :: `,error);
      this.loginError$.next('Invalid user name or password, please try again');
    });
  }

  public logoutUser(){
    if(localStorage.getItem('loggedInUser')){
      localStorage.removeItem('loggedInUser');
      this.isUserLoggedIn$.next(false);
      console.log(`AppService :: logoutUser :: logged out`)
    }
  }

  private _setPreferredTheme(theme_: string){
    console.log(`AppService :: _setPreferredTheme :: Entering...`);
    if(theme_){
      localStorage.setItem('themePreference',theme_);
      console.log(`AppService :: _setPreferredTheme :: Theme set as :`,localStorage.getItem('themePreference'));
    }
    if(localStorage.getItem('themePreference')){    
      this._setThemeClass(localStorage.getItem('themePreference'));
    }
  }

  private _setThemeClass(class_: string){
    switch(class_){
      case 'light': 
      if(document.body.classList && document.body.classList.contains('dark')){
        document.body.classList.remove('dark');
      }
      document.body.classList.add('light');
      break;

      case 'dark':
      if(document.body.classList && document.body.classList.contains('light')){
        document.body.classList.remove('light');
      }
      document.body.classList.add('dark');
      break;

    }
  }
}