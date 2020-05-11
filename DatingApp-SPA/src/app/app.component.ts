import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DatingApp-SPA';

  constructor(private authService: AuthService) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodeToken(token);
    }

    if (user) {
      this.authService.currentUser = user;
      this.authService.changeAvatar(user.photoUrl || 'assets/user.png');
    }
  }
}
