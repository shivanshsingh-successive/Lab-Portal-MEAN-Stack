import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { TeacherService } from './teacher.service';

@Injectable()

export class TeacherInterceptor implements HttpInterceptor {
    constructor(private teacherservice: TeacherService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.teacherservice.getToken();
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });
        return next.handle(req);
    }
}