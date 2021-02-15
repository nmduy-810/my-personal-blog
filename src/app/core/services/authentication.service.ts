import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../entities/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  
  constructor(private router: Router, private http: HttpClient) 
  {
    this.userSubject = new BehaviorSubject(new User());
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.developmentUrl}/users/authenticate`, { username, password }, { withCredentials: true})
    .pipe(map(user => {
      this.userSubject.next(user);
      this.startRefreshTokenTimer();
      return user;
    }));
  }

  logout() {
    this.http.post<any>(`${environment.developmentUrl}/users/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        //this.userSubject.next(null);
        this.router.navigate(['/login']);
  }
  
  refreshToken() {
    return this.http.post<any>(`${environment.developmentUrl}/users/refresh-token`, {}, { withCredentials: true })
      .pipe(map((user) => {
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
    }));
  }

   //helpers methods
   private refreshTokenTimeout: any;

  startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

}
