import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {forkJoin} from 'rxjs';
import {IClinic, IDoctor, ISpeciality, ClinicId, SpecialityId} from '../models';
import {ClinicsService} from '../services/clinics.service';
import {DoctorsService} from '../services/doctors.service';
import {ProfileService} from '../services/profile.service';
import {AppointmentFormComponent} from './appointment-form/appointment-form.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private profileService: ProfileService,
    private clinicsService: ClinicsService,
    private doctorsService: DoctorsService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
  ) {}

  private clinics: IClinic[] = [];
  private doctors: IDoctor[] = [];
  private visibleDoctors: IDoctor[] = [];
  private specialities: ISpeciality[] = [];

  private selectedSpeciality: SpecialityId;
  private selectedClinic: ClinicId;

  ngOnInit() {
    forkJoin(
      this.clinicsService.getAll(),
      this.doctorsService.getAll(),
    ).subscribe(([clinics, doctors]) => {
      this.clinics = clinics.sort(
        (clinic1, clinic2) => clinic2.doctors.length - clinic1.doctors.length,
      );

      this.doctors = doctors;
      this.showAllDoctors();

      this.doctors.forEach(({speciality_id, speciality}) => {
        const found: boolean = !!this.specialities.find(
          currSpeciality => currSpeciality.id === speciality_id,
        );

        if (!found) {
          this.specialities.push({
            id: speciality_id,
            name: speciality,
          });
        }
      });
    });
  }

  isLogged(): boolean {
    return !!this.profileService.getCurrentUser();
  }

  showAllDoctors(): void {
    this.selectedClinic = undefined;
    this.selectedSpeciality = undefined;
    this.visibleDoctors = [...this.doctors];
  }

  toggleSpeciality(specialityId: SpecialityId = this.selectedSpeciality): void {
    const {selectedSpeciality} = this;
    this.showAllDoctors();

    if (selectedSpeciality !== specialityId) {
      this.visibleDoctors = this.doctors.filter(
        doctor => doctor.speciality_id === specialityId,
      );
      this.selectedSpeciality = specialityId;
    }
  }

  toggleClinic(clinicId: ClinicId = this.selectedClinic): void {
    const {selectedClinic} = this;
    this.showAllDoctors();

    if (selectedClinic !== clinicId) {
      this.visibleDoctors = this.doctors.filter(
        doctor => doctor.clinics.includes(clinicId),
      );
      this.selectedClinic = clinicId;
    }
  }

  selectedSpecialityName(): string {
    const {selectedSpeciality} = this;

    return selectedSpeciality
      ? this.specialities.find(
          speciality => speciality.id === selectedSpeciality,
        ).name
      : '';
  }

  deselectSpeciality(event: Event): void {
    event.preventDefault();
    this.toggleSpeciality();
  }

  getClinicById(clinicId: ClinicId): IClinic {
    return this.clinics.find(clinic => clinic.id === clinicId);
  }

  selectedDoctorsHeader(): string {
    if (this.selectedClinic) {
      return 'Врачи, принимающие тут';
    }

    if (this.selectedSpeciality) {
      return 'Врачи выбранной специальности';
    }

    return 'Все врачи';
  }

  filtersApplied(): boolean {
    return !!(this.selectedClinic || this.selectedSpeciality);
  }

  openAppointmentForm(doctor: IDoctor): void {
    if (this.isLogged()) {
      this.bottomSheet.open(AppointmentFormComponent, {
        data: {
          doctor,
          clinics: this.clinics,
        },
      });
    } else {
      this.router.navigateByUrl('/auth');
    }
  }
}
