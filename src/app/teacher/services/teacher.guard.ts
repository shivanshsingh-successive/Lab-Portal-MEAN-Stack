import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TeacherService } from './teacher.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  constructor(private router: Router,private teacherservice: TeacherService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.teacherservice.isLoggedIn === true) {
        window.alert("User is already logged in!");
        this.router.navigate([this.teacherservice.getCurrentUrl()])
      }
      return true;
  }
  
}
