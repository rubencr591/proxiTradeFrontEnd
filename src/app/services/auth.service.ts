import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { UserService } from './user.service';
import { User } from '../model/user';
import { ProductService } from './product.service';
import { ConversationsService } from './conversations.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'idToken';

  constructor(private afAuth: AngularFireAuth,
     private alertController: AlertController, 
     private userService:UserService, 
     private productService:ProductService,
     private conversationService:ConversationsService) { 

        this.afAuth.onAuthStateChanged(user => {
          if (user) {
            user.getIdToken().then(idToken => {
              localStorage.setItem('idToken', idToken);
            });
    
            user.getIdTokenResult().then(idTokenResult => {
              const refreshTime = (new Date(idTokenResult.expirationTime).getTime() - new Date().getTime()) * 0.9;
              setTimeout(() => this.refreshToken(), refreshTime);
            });
          } else {
            localStorage.removeItem('idToken');
          }
        });
  }

  private async refreshToken(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      localStorage.setItem('idToken', idToken);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  async register(): Promise<boolean>{
    let result;
    try {
      const newUser = this.userService.getCurrentUser();

      // Crear usuario en Firebase
      result = await this.afAuth.createUserWithEmailAndPassword(newUser.getEmail(), newUser.getPassword());
  
  
      newUser.setUid(result.user.uid);
      
      // Realizar la solicitud al backend y esperar su respuesta
      const success = await new Promise<boolean>((resolve, reject) => {
        this.userService.registerUser(newUser).subscribe({
          next: (value) => resolve(value),
          error: (error) => reject(error)
        });
      });
  
      if (success) {
        return this.login(newUser.getEmail(), newUser.getPassword());
        
      } else {
        // Si no se pudo registrar el usuario, se elimina el usuario de autenticación
        await result.user.delete();
        console.error('Failed to register user');
        return false;
      }
    } catch (error) {
      // Si hubo un error, se elimina el usuario de autenticación
      if (result && result.user) {
        await result.user.delete();
      }
    
      this.presentErrorAlert(this.extractErrorMessage(error));
      throw error;
    }
  }
  
  

  // Método para iniciar sesión
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Iniciar sesión en Firebase
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      
      const idToken = await result.user?.getIdToken();
      // Realizar la solicitud al backend y esperar su respuesta
      const success = await new Promise<boolean>((resolve, reject) => {
        this.userService.loginUser(email, password).subscribe({
          next: (value) => resolve(value),
          error: (error) => reject(error)
        });
      });

      if (success) {
        localStorage.setItem('idToken', idToken);
        this.userService.setCurrentUser(new User(result.user.uid, email, '', '', 0));
        return true;
      } else {
        console.error('Failed to login user');
        return false;
      }
    } catch (error) {
      this.presentErrorAlert(this.extractErrorMessage(error));
      throw error;
    }
  }


  // Método para cerrar sesión
  async logout() {
    try {
      await this.afAuth.signOut();
      this.userService.setCurrentUser(null);
      this.productService.setProducts([]);
      this.productService.setMyProducts([]);
      this.conversationService.setConversations([]);
      this.conversationService.setSelectedConversation(null);
      localStorage.removeItem('idToken');


      return true;
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener el estado de la autenticación
  getAuthState() {
    return this.afAuth.authState;
  }

  async presentErrorAlert(errorMessage: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = "";

    if (error && error.error) {
      // Si el error es un objeto que contiene un mensaje, usar ese mensaje
      errorMessage = error.error;
    }else if (error && error.message) {
      errorMessage = error.message;
      errorMessage = errorMessage.replace(/^Firebase: /i, '');
      errorMessage = errorMessage.replace(/\(auth\/[^)]+\)/i, '');
      errorMessage = errorMessage.trim().replace(/\.$/, '');
    } 
    return errorMessage;
  }
}
