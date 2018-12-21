import {Component} from '@angular/core';
import {ProfileService} from '../services/profile.service';

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
  constructor(private profileService: ProfileService) {}

  private selectedTab: Tabs = Tabs.Registration;

  private signupModel = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    password: '',
  };

  private authModel = {
    id: '',
    password: '',
  };

  private registred = false;
  private loggedIn = false;

  private registrationError = '';
  private loggingInError = '';

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

  register(): void {
    const {email, firstName, lastName, middleName, password, phone} = this.signupModel;

    this.profileService.register(firstName, lastName, middleName, email, phone, password).subscribe(
      () => this.registred = true,
      ({error}) => this.registrationError = error,
    );
  }

  auth(): void {
    const {id, password} = this.authModel;

    this.profileService.logIn(id, password).subscribe(
      () => this.loggedIn = true,
      ({error}) => this.loggingInError = error,
    );
  }
}
