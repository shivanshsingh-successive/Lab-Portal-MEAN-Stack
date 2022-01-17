import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  profileForm = new FormGroup({
    firstname: new FormControl(null,Validators.required),
    username: new FormControl(null,[ Validators.required, Validators.minLength(10) ]),
    password: new FormControl(null,[ Validators.required, Validators.minLength(5) ])
  });
  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {}

  onSubmit()
  {
    this.authservice.signUp(this.profileForm.value).subscribe((res) => {
      if (res === null) {
        this.profileForm.reset()
        this.router.navigate(['sign-up']);
      }
      else {
        window.alert('Registration successfull')
        this.router.navigate(['log-in'])
      }
    })
  }
}
