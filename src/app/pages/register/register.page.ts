import { Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentialForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
      private userService:UserService,
      private router:Router
    ) {
  }

  ngOnInit() {
    this.credentialForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


    
  }


  login() {
    this.router.navigate(['/login']);
  }

   register() {
    const { username, email, phone, password } = this.credentialForm.value;
    
    const newUser = new User('', email, username, password, phone);

    this.credentialForm.reset();
    this.userService.setCurrentUser(newUser);
    
    this.router.navigate(['/address']);

   
  }
  

  

}
