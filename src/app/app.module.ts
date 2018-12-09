import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';

import {JwtService} from './services/jwt.service';
import {ApiService} from './services/api.service';
import {ClinicsService} from './services/clinics.service';
import {DoctorsService} from './services/doctors.service';
import {AuthComponent} from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [
    JwtService,
    ApiService,
    ClinicsService,
    DoctorsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
