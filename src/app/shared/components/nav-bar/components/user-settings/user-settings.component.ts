import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  public userName = '';
  public isOpen = false;
  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.currentSession$.subscribe(token => {
      this.userName = token?.LoginName;
    });
  }

  public logOut(): void {
    this.auth.logout();
  }
}
