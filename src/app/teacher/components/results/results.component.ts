import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Report } from 'src/app/services/report';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
labno;
code;
result : Report = new Report();
  constructor(private actRoute: ActivatedRoute,
              private authservice: AuthService ) {
    this.code = this.actRoute.snapshot.paramMap.get('code');
    this.labno = this.actRoute.snapshot.paramMap.get('lab-no');
    this.authservice.getResults(this.code,this.labno).subscribe(res => {
      this.result = res.msg;
    })
   }

  ngOnInit(): void {
  }

  view(file){
    window.open('http://localhost:3400/uploads/'+file);
  }
  
  download(filename){
  this.authservice.downloadFile(filename)
  .subscribe(
      data => saveAs(data, filename),
      error => console.error(error)
  );
  }
}
