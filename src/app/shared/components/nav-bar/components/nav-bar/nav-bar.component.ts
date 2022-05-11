import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarLink } from '../..';
import { NAV_BAR_LINKS } from '../../../../constants';
import { AuthenticationService } from '../../../../services';
import { PermissionService } from '../../../../services/permission-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  public links: NavBarLink[] = NAV_BAR_LINKS;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private permissionService: PermissionService,
  ) {}

  public onOpen(link: NavBarLink) {
    this.router.navigate([link.path]);
  }

  public logOut(): void {
    this.auth.logout();
  }

  public hasPermission(link: NavBarLink): boolean {
    return this.permissionService.hasPermission(link.permissions);
  }
}
