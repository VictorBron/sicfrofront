import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthSession } from './shared/models';
import { AuthenticationService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public showNavBar = false;
  constructor(private translate: TranslateService, private auth: AuthenticationService) {}

  ngOnInit() {
    this.translate.setDefaultLang('es');
    this.auth.currentSession$.subscribe((token: AuthSession) => {
      this.showNavBar = !!token;
    });
  }
}
