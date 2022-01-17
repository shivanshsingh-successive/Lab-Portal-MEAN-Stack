import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus;
  loginForm = new FormGroup({
    username: new FormControl(null,[ Validators.required, Validators.minLength(10) ]),
    password: new FormControl(null,[ Validators.required, Validators.minLength(5) ])
  });
  constructor(private authservice:AuthService) { }

  ngOnInit(): void { }

  onlogin(){
  this.authservice.signIn(this.loginForm.value)
  }
}
