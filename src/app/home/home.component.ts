import {Component, OnInit} from '@angular/core';
import {IClinic, IDoctor, ISpeciality} from '../models';
import {ClinicsService} from '../services/clinics.service';
import {DoctorsService} from '../services/doctors.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private clinicsService: ClinicsService,
    private doctorsService: DoctorsService,
  ) {}

  private clinics: IClinic[] = [];
  private doctors: IDoctor[] = [];
  private specialities: ISpeciality[] = [];

  private selectedSpeciality: number;

  ngOnInit() {
    this.clinicsService.getAll().subscribe(clinics => {
      this.clinics = clinics;
    });

    this.doctorsService.getAll().subscribe(doctors => {
      this.doctors = doctors;

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

  selectSpeciality(specialityId: number) {
    this.selectedSpeciality = (this.selectedSpeciality === specialityId)
      ? undefined
      : specialityId;
  }
}
