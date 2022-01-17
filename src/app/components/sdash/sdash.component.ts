import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user';
import { Subject } from 'src/app/services/subject';

@Component({
  selector: 'app-sdash',
  templateUrl: './sdash.component.html',
  styleUrls: ['./sdash.component.css']
})
export class SdashComponent implements OnInit {
  currentUser : User = new User();
  ids : Subject = new Subject();
  constructor(
    public authservice: AuthService,
    private actRoute: ActivatedRoute
  ) {
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.authservice.getUserProfile(id).subscribe(res => {
      this.currentUser = res.msg;
    })
  }


  ngOnInit(): void {

    this.authservice.getsubject().subscribe(data => {
      data.forEach((element,index=0) => {
        this.ids[index] = element;
        index++;
      })
    })
  }
}

