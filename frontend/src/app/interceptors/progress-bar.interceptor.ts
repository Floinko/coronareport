import { ProgressBarService } from './../services/progress-bar.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class ProgressBarInterceptor implements HttpInterceptor {

  constructor(private progressBarService: ProgressBarService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    return next.handle(request).pipe(
      tap(res => {
        if (res.type === HttpEventType.Sent) {
          this.progressBarService.progressBarState = true;
        }
        if (res.type === HttpEventType.Response) {
          this.progressBarService.progressBarState = false;
        }
      }));
  }
}
