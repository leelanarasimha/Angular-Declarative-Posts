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
    tap(this.clear())
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap(this.clear())
  );

  constructor(
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  clear() {
    return () => {
      setTimeout(() => {
        this.notificationService.clearMessages();
      }, 2000);
    };
  }
}
