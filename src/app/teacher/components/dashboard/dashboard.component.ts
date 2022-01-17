import { Component, OnInit, EventEmitter } from '@angular/core';
import { Teacher } from 'src/app/teacher/services/teacher';
import { TeacherService } from '../../services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser : Teacher = new Teacher();

  constructor(
    public teacherservice: TeacherService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.teacherservice.getUserProfile(id).subscribe(res => {
      this.currentUser = res.msg;
    })
  }

  ngOnInit(): void {  }

  onclick(code: string){
    this.teacherservice.getsubject(code)
    .subscribe(data =>{
      this.router.navigate(['./subject',data[0]._id], { relativeTo: this.actRoute })
    })
  }

}
