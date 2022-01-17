import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'src/app/services/subject';
import { AuthService } from 'src/app/services/auth.service';
declare var $ : any;
@Component({
  selector: 'app-addsubject',
  templateUrl: './addsubject.component.html',
  styleUrls: ['./addsubject.component.css']
})
export class AddsubjectComponent implements OnInit {
  currentSubject : Subject = new Subject();
  formdata = new FormGroup({
    SubjectCode: new FormControl(),
    LabNo: new FormControl(),
    Question: new FormControl(null,Validators.required)
  });
  
  openPopup()
  {
    $("#myModal").modal("show");
  }
    constructor(
      public authservice: AuthService,
      private actRoute: ActivatedRoute,
      private route: Router
    ) {
      let id = this.actRoute.snapshot.paramMap.get('subj-id');
      this.authservice.getSubjectDetails(id).subscribe(res => {
        this.currentSubject = res.msg;
        this.formdata.get('SubjectCode').setValue(this.currentSubject.code);
        this.formdata.get('LabNo').setValue((this.currentSubject.experiments.length)+1);
      })
    }

  ngOnInit(): void { }

  on_submit(){
    console.log(this.formdata.value);
    this.authservice.addsubject(this.formdata.value.SubjectCode,this.formdata.value.LabNo,this.formdata.value.Question)
    .subscribe((res) => {
      if(res == null) 
        this.formdata.reset();
      else {
        alert('Successfully added');
        $('.modal-backdrop').remove();
        this.route.navigate([this.authservice.getPreviousUrl()]);
      }
    })
  }

  close(){
    this.formdata.reset();
  }
}
