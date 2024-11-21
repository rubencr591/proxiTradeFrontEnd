import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editProfileForm: FormGroup;
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: [''],
      kmRatio: [0, Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.userService.getCurrentUserInfo().subscribe((user: User) => {
      this.user = user;
      this.editProfileForm.patchValue({
        name: user.name,
        phone: user.phone,
        kmRatio: user.kmRatio,
      });
    });
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      const updatedUser = { ...this.user, ...this.editProfileForm.value };
      this.userService.updateUser(this.authService.getToken(), updatedUser).subscribe(
        () => {
          this.router.navigate(['/tabs/tab3']);
        },
        (error) => {
          console.error('Error updating profile', error);
        }
      );
    }
  }
}
