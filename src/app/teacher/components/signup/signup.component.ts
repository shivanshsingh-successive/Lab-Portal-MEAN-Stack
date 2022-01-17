import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  profileForm = new FormGroup({
    firstname: new FormControl(null,Validators.required),
    code: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required),
  });
  constructor(private teacherservice: TeacherService,private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit()
  {
    this.teacherservice.signUp(this.profileForm.value).subscribe((res) => {
      if (res === null) {
        this.profileForm.reset()
        this.router.navigate(['teacher/sign-up']);
      }
      else {
        window.alert('Registration successfull')
        this.router.navigate(['teacher/sign-in'])
      }
    })
  }
}
