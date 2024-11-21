import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss'],
})
export class UserListModalComponent  implements OnInit {
  users: any[] = []; 
  searchTerm: string = '';

  private searchTermChanged: Subject<string> = new Subject<string>();


  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.searchTermChanged
    .pipe(
      debounceTime(1000) 
    )
    .subscribe(() => {
      if(this.searchTerm.length > 0){
        this.searchUsers();
      }
    });
  }

  // Método para modificar el searchTerm cuando el usuario escribe en el input
  searchChanged(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm) {
      this.searchTermChanged.next(this.searchTerm);
    }else{
      this.users = [];
    }
  }

// Método para realizar la búsqueda en el backend
  async searchUsers() {
  this.userService.getAllUsersByName(this.searchTerm).subscribe((users: any) => {
    this.users = users;

  });
}

  selectUser(userSelected: User) {
    this.modalCtrl.dismiss(userSelected);
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }

}
