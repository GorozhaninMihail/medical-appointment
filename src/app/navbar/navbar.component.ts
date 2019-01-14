import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {IUser} from '../models';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

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

  private mainPage: boolean;
  private loading = true;
  private user: IUser;

  ngOnInit() {
    this.profileService.currentUser.subscribe(user => {
      this.user = user;
      this.loading = false;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.mainPage = event.url === '/';
      });
  }

  logout(): void {
    this.profileService.logOut();
    this.router.navigateByUrl('');
  }
}
