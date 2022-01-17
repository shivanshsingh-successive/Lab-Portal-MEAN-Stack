import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CompileService } from '../services/compile.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from '../services/subject';
import { saveAs } from 'file-saver';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

import * as ace from 'ace-builds';
import 'ace-builds/webpack-resolver';

import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-monokai';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';

const URL = 'http://localhost:3400/api/upload'; 

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements AfterViewInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  images;id;code;labno;input;
  currentLab : Subject = new Subject();
  output: string = 'Compilation result....';
  themeid: number = 1;
  filename: string = 'Nodes.pdf';

  constructor(private compileservice: CompileService,
    public authservice: AuthService,
    private actRoute: ActivatedRoute,
    private router:Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.code = this.actRoute.snapshot.paramMap.get('subj-code');
    this.labno = this.actRoute.snapshot.paramMap.get('lab-no');
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.authservice.getLabDetails(this.code,this.labno).subscribe(res => {
      this.currentLab = res.message;
    })
  } 

  ngOnInit(): void { 
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
  }

  @ViewChild('editor') editor;

  ngAfterViewInit() {

    ace.require("ace/ext/language_tools");
    var editor = ace.edit(document.getElementById("editor"));
    console.log('e: ',editor);
    this.editor.setOptions({
      showLineNumbers: true,
      tabSize: 3,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      minLines: 14,
      maxLines: Infinity,
      highlightSelectedWord: true,
      showFoldWidgets: true
    });
    this.editor.setMode("c_cpp");
    this.editor.setTheme("monokai");
    this.editor.value = `#include <stdio.h>
  int main() {
    //code
    return 0;
  }`;
}

  public consoleCode(){
    const code = this.editor.value;
    this.compileservice.getOutput(this.themeid,code,this.input).subscribe((data) =>{
      console.log(data);
      this.output = data.output;
    })
  }

  public themes(t) {
    if (t == 1)
      this.editor.setTheme('github');
    else if(t == 2)
      this.editor.setTheme('twilight');
    else
      this.editor.setTheme('monokai');
  }

public selectLanguage(id){
  this.editor.value = '';
  this.themeid = id;
  if(id == 1) {
    this.editor.setMode('c_cpp');
    this.editor.value = `#include <stdio.h>
  int main() {
    //code
    return 0;
  }`;
  }
  else if(id == 2) {
    this.editor.setMode('c_cpp');
    this.editor.value = `#include <iostream>
  using namespace std;

  int main() {
    //code
    return 0;
  }`;
  }
  else if(id == 3){
    this.editor.setMode('java');
    this.editor.value = `import java.io.*;

  class Mean {
    public static void main (String[] args) {
      System.out.println("Wow!");
    }
  }`;
  }

  else if(id == 4) {
    this.editor.setMode('python');
    this.editor.value = `#code
print("Start Code")`;
  }
}

  public clearCode(){
    this.editor.value = '';
    this.output = 'Compilation result....';
    this.input = '';
  }

  public upload() {
    this.router.navigate(['/user-profile/'+this.id+'/'+this.labno+'/'+this.code+'/upload']);
  }


  public downloadCode() {
    var codedetails = {
      lab: this.currentLab.experiments[0].labno,
      question: this.currentLab.experiments[0].question,
      code: this.editor.value,
      output: this.output
    }
    this.authservice.downloadCode(codedetails)
    .subscribe(
      data =>  saveAs(data,'Preview.pdf'),
      error => console.error(error)
  );
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }
  
  onSubmit(){
    const formData = new FormData();
    formData.append('file', this.images);
    formData.append('_id',this.id);
    formData.append('labno',this.labno);
    this.http.post<any>(`http://localhost:3400/api/upload/${this.id}/${this.labno}/${this.code}`, formData).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success('File successfully uploaded!');
      },
      (err) => {
      console.log(err);
      this.toastr.error('File type not accepted!');
      }
    );
  }
}
