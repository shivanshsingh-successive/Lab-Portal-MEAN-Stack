import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SdashComponent } from './components/sdash/sdash.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { SubjDetailsComponent } from './components/subj-details/subj-details.component';
import { SigninComponent } from './teacher/components/signin/signin.component';
import { SignupComponent } from './teacher/components/signup/signup.component';
import { DashboardComponent } from './teacher/components/dashboard/dashboard.component';
import { TeacherGuard } from './teacher/services/teacher.guard';
import { AddsubjectComponent } from './teacher/components/addsubject/addsubject.component';
import { ResultsComponent } from './teacher/components/results/results.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'log-in', component: LoginComponent,canActivate:[TeacherGuard] },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'user-profile/:id', component: SdashComponent, canActivate: [AuthGuard] },
  { path: 'user-profile/:id/subject/:subj-id', component: SubjDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-profile/:id/subject/:subj-id/lab/:subj-code/:lab-no', component: CodeEditorComponent, canActivate: [AuthGuard] },
  { path: 'teacher/sign-in', component: SigninComponent,canActivate: [TeacherGuard] },
  { path: 'teacher/sign-up',component: SignupComponent },
  { path: 'profile/:id',component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id/subject/:subj-id', component: AddsubjectComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id/subject/:subj-id/results/:code/:lab-no', component: ResultsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
