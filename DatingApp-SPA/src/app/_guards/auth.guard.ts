import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const roles = next.firstChild.data.roles as Array<string>;

    if (roles) {
      const match = this.authService.roleMatch(roles);

      if (match) {
        return true;
      } else {
        this.router.navigate(['/']);
        this.alertifyService.error('You are not athorized to access this area');
      }
    }

    if (this.authService.loggedIn()) {
      return true;
    }
    this.alertifyService.error('You shall not pass!!!');
    this.router.navigate(['/']);
    return false;
  }
}
