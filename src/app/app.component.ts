import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from './services/Loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Angular-Declarative-Posts';
  showLoader$ = this.loaderService.loadingAction$;
  constructor(private loaderService: LoaderService) {}
}
