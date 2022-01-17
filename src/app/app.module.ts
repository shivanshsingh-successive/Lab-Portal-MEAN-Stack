import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SdashComponent } from './components/sdash/sdash.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { AddsubjectComponent } from './teacher/components/addsubject/addsubject.component';
import { AuthInterceptor } from './services/authconfig.interceptor';
import { SubjDetailsComponent } from './components/subj-details/subj-details.component';
import { SigninComponent } from './teacher/components/signin/signin.component';
import { TeacherService } from './teacher/services/teacher.service';
import { SignupComponent } from './teacher/components/signup/signup.component';
import { DashboardComponent } from './teacher/components/dashboard/dashboard.component';
import { TeacherInterceptor } from '../app/teacher/services/teacherconfig.interceptor';
import { TeacherGuard } from './teacher/services/teacher.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';
import { MenuComponent } from './menu/menu.component';
import { ResultsComponent } from './teacher/components/results/results.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CompileService } from './services/compile.service';

@NgModule({
  declarations: [
    AppComponent,
    SdashComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddsubjectComponent,
    SubjDetailsComponent,
    SigninComponent,
    SignupComponent,
    DashboardComponent,
    MenuComponent,
    ResultsComponent,
    CodeEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    PdfViewerModule,
    AceEditorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard,AuthService,TeacherService,TeacherGuard,CompileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TeacherInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
