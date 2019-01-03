import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {IUser} from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) {}

  private loading = true;
  private user: IUser;

  ngOnInit() {
    this.profileService.currentUser.subscribe(user => {
      this.user = user;
      this.loading = false;
    });
  }

  logout(): void {
    this.profileService.logOut();
    this.router.navigateByUrl('');
  }
}
