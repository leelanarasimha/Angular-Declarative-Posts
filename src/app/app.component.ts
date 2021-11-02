import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tap } from 'rxjs';
import { LoaderService } from './services/Loader.service';
import { NotificationService } from './services/Notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Angular-Declarative-Posts';
  showLoader$ = this.loaderService.loadingAction$;
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 5000);
      }
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap((message) => {
      if (message) {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 5000);
    }
    })
  );

  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}
}
