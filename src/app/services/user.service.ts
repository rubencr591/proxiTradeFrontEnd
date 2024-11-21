import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Image } from '../model/image';
import { Location } from '../model/location';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myUser: User;

  private apiUrlUser =  environment.urlBackend +"api/users";

  constructor(private http:HttpClient) {}

  setCurrentUser(currentUser: User): void {
    this.myUser = currentUser;
  }
  getCurrentUser(): User {
    return this.myUser;
  }

  setLocationCurrentUser(location: Location): void {
    this.myUser.setLocation(location);
  }

  registerUser(newUser: User): Observable<boolean> {
    const urlRegister = this.apiUrlUser + "/register";

    return this.http.post<User>(urlRegister, newUser).pipe(
      map((user: User) => {
            this.myUser = user;
            return true; 
        }),
        catchError(error => {
            console.error('Error registering user:', error);
            throw error;
        })
    );
  }

  loginUser(email: string, password: string): Observable<boolean> {
    const urlLogin = this.apiUrlUser + "/login";


    const user = {
        email: email,
        password: password
    };

    return this.http.post<User>(urlLogin, user).pipe(
      map((user: User) => {
            this.myUser = user;
            return true; 
        }),
        catchError(error => {
            console.error('Error logging in user:', error);
            return of(false); 
        })
    );
  }


  
  getAllUsersByName(name:string): Observable<User[]> {
    const urlGetAllUsers = this.apiUrlUser + "/all/" + name;
    return this.http.get<User[]>(urlGetAllUsers);
  }

  getUserById(id: string): Observable<User> {
    const urlGetUser = this.apiUrlUser + "/" + id;
    return this.http.get<User>(urlGetUser);
  }



  getCurrentUserInfo(): Observable<User> {
    const urlGetUser = `${this.apiUrlUser}`;

    return this.http.get<User>(urlGetUser).pipe(
      map((user: any) => {
        const newUser = new User(user.uid, user.email, user.name, user.password, user.phone);
        newUser.setProfilePicture(user.profilePicture);
        newUser.setKmRatio(user.kmRatio);
        newUser.setLocation(
          new Location(
          user.location.street,
          user.location.postalCode,
          user.location.numberLetter,
          user.location.country,
          user.location.province,
          user.location.city,
          user.location.community,
          user.location.latitude,
          user.location.longitude));

        if (newUser.getProfilePicture()) {
          newUser.setProfilePicture('data:image/' + Image.detectImageExtension(newUser.getProfilePicture()) + ';base64,' + newUser.getProfilePicture());
        }
        return newUser;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  updateUser(token: string, updatedUser: User): Observable<boolean> {
    const urlUpdateUser = `${this.apiUrlUser}`;
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

    return this.http.put<User>(urlUpdateUser, updatedUser, { headers: headers }).pipe(
      map((user: User) => {
        this.myUser = user;
        return true;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return of(false);
      })
    );
  }

  updateProfilePicture(base64Image: string): Observable<boolean> {
    const urlUpdateProfilePicture = `${this.apiUrlUser}/profilePicture`;
  
    const base64 = base64Image ? base64Image.split(',')[1] : '';

    return this.http.put<boolean>(urlUpdateProfilePicture, base64).pipe(
      map((success) => {
        if (success) {
          return true; 
        }
        return false;
      })
    );
  }
  

  updateUserLocation(){
    const urlUpdateLocation = `${this.apiUrlUser}/location`;
    return this.http.put<boolean>(urlUpdateLocation, this.myUser.getLocation());
  
  }

  getUserName(): string {
    return this.myUser.getName();
  }

  getUserId(): string {
    return this.myUser.getUID();
  }
}
