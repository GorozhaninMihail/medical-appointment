import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

enum Tabs {
  Registration = 0,
  Auth = 1,
  PasswordRecovery = 2,
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  selectedTab: Tabs = Tabs.Registration;

  firstName = new FormControl('');

  setTab(tabIndex: Tabs): void {
    this.selectedTab = tabIndex;
  }

  setTabRegistration(event: Event): void {
    event.preventDefault();
    this.selectedTab = Tabs.Registration;
  }

  setTabAuth(event: Event): void {
    event.preventDefault();
    this.selectedTab = Tabs.Auth;
  }

  setTabPasswordRecovery(event: Event): void {
    event.preventDefault();
    this.selectedTab = Tabs.PasswordRecovery;
  }
}
