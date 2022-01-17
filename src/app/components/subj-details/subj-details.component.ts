import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'src/app/services/subject';

@Component({
  selector: 'app-subj-details',
  templateUrl: './subj-details.component.html',
  styleUrls: ['./subj-details.component.css']
})
export class SubjDetailsComponent implements OnInit {

  currentSubject : Subject = new Subject();
  
  constructor(
    public authservice: AuthService,
    private actRoute: ActivatedRoute
  ) {
    let id = this.actRoute.snapshot.paramMap.get('subj-id');
    this.authservice.getSubjectDetails(id).subscribe(res => {
      this.currentSubject = res.msg;
    })
  }

  ngOnInit(): void {
  }

}
