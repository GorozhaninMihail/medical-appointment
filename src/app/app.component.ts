import {Component, OnInit} from '@angular/core';
import {ProfileService} from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private userService: ProfileService) {}

  ngOnInit() {
    this.userService.fetchCurrentUser();
  }
}
