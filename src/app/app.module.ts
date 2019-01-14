import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MAT_DATE_LOCALE} from '@angular/material';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from './material.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';

import {JwtService} from './services/jwt.service';
import {ApiService} from './services/api.service';
import {ClinicsService} from './services/clinics.service';
import {DoctorsService} from './services/doctors.service';
import {AuthComponent} from './auth/auth.component';
import {JwtInterceptor} from './interceptors/jwt.interceptor.ts.service';

import {AppointmentFormComponent} from './home/appointment-form/appointment-form.component';
import {ProfileComponent} from './profile/profile.component';
import {ConsultationFormComponent} from './home/consultation-form/consultation-form.component';
import { QuestionComponent } from './question/question.component';
import { UserFioPipe } from './pipes/user-fio.pipe';
import { TimesheetFormComponent } from './profile/timesheet-form/timesheet-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AuthComponent,
    AppointmentFormComponent,
    ProfileComponent,
    ConsultationFormComponent,
    QuestionComponent,
    UserFioPipe,
    TimesheetFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    MatMomentDateModule,
    FlexLayoutModule,
  ],
  providers: [
    JwtService,
    ApiService,
    ClinicsService,
    DoctorsService,
    UserFioPipe,
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    AppointmentFormComponent,
    ConsultationFormComponent,
    TimesheetFormComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
