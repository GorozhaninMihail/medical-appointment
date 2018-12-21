import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {IUser} from '../models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private profileService: ProfileService) {}

  currentUser() {
    return this.profileService.getCurrentUser();
  }

  logout(): void {
    this.profileService.logOut();
  }
}
