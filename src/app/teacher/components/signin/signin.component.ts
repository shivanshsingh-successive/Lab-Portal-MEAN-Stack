import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  focus;
  loginForm = new FormGroup({
    username: new FormControl(null,Validators.required),
    password: new FormControl(null,[ Validators.required,Validators.minLength(5)])
  });
  constructor(private teacherservice: TeacherService) { }

  ngOnInit(): void { }

  onlogin(){
  this.teacherservice.signIn(this.loginForm.value);
  }
}
