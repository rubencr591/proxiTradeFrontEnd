import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      take(1),
      map(user => {
        if (user) {
          const userLogged = new User( user.uid, user.email, "", "", -1);

          this.userService.setCurrentUser(userLogged);

          return true; 
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
