import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {ProfileService} from '../services/profile.service';
import {IOrder, IUser, IConsultation, IDoctor, ISpeciality, SpecialityId, IClinic} from '../models';
import {ConsultationService} from '../services/consultation.service';
import {DoctorsService} from '../services/doctors.service';
import {flatMap, filter} from 'rxjs/operators';
import {OrderService} from '../services/order.service';
import {AdminService} from '../services/admin.service';
import {ClinicsService} from '../services/clinics.service';
import {UserFioPipe} from '../pipes/user-fio.pipe';
import {MatBottomSheet} from '@angular/material';
import { TimesheetFormComponent } from './timesheet-form/timesheet-form.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private bottomSheet: MatBottomSheet,
    private profileService: ProfileService,
    private consultationService: ConsultationService,
    private doctorService: DoctorsService,
    private orderSerive: OrderService,
    private adminService: AdminService,
    private clinicsService: ClinicsService,
    private userFioPipe: UserFioPipe,
  ) {}

  private selectedTab = 0;
  private user: IUser;

  private orders: IOrder[];
  private consultations: IConsultation[];
  private doctors: IDoctor[];

  private adminData?: {
    stats?: any;
    specialities?: ISpeciality[],
    clinics?: IClinic[],
  };

  private loaded = false;

  // Form models
  private doctorToAdd: any = {
    id: '',
    specialityId: '',
    experience: '',
    information: '',
    active: true,
  };
  private specialityName = '';

  // Form errors
  private addDoctorError = '';
  private addSpecialityError = '';

  private displayedColumns = [
    'date',
    'time',
    'doctor',
    'symbol',
    'status',
  ];

  ngOnInit() {
    this.profileService.currentUser.pipe(
      filter(user => !!user),
      flatMap(user => {
        this.user = user;

        let requests: any = [
          this.orderSerive.getOrders(),
          this.consultationService.getAll(),
          this.doctorService.getAll(),
        ];

        if (user.role === 'admin') {
          requests.push(
            this.adminService.getStats(),
            this.adminService.getAllSpecialities(),
            this.clinicsService.getAll(),
          );
        }

        return forkJoin(...requests);
      }),
    ).subscribe(([orders, consultations, doctors, ...adminData]) => {
      this.orders = orders;
      this.consultations = (consultations as IConsultation[])
        .sort((c1, c2) => new Date(c2.time).getTime()
          - new Date(c1.time).getTime());
      this.doctors = doctors;

      const [stats, specialities, clinics] = adminData;

      this.adminData = {
        stats,
        specialities,
        clinics,
      };

      this.loaded = true;
    });
  }

  setTab(tabIndex: number): void {
    this.selectedTab = tabIndex;
  }

  role(): string {
    const roles = {
      user: 'Пользователь',
      doctor: 'Врач',
      admin: 'Администратор',
    };

    return roles[this.user.role];
  }

  getConsultationSubject(consultation: IConsultation): string {
    const {doctors} = this;
    const {doctor_id, specialist_id} = consultation;

    const doctorInfo = doctor_id
      ? doctors.find(doc => doc.doctor_id === doctor_id)
      : doctors.find(doc => doc.speciality_id === specialist_id);

    const speciality = doctorInfo.speciality.toLowerCase();

    const subject = doctor_id
      ? `${this.userFioPipe.transform(doctorInfo)}. (${speciality})`
      : `${speciality} (любой врач)`;

    return subject;
  }

  countDoctorsBySpeciality(specialityId: SpecialityId): number {
    return this.doctors
      .filter(({speciality_id}) => speciality_id === specialityId)
      .length;
  }

  openTimesheetForm(doctor: IDoctor): void {
    this.bottomSheet.open(TimesheetFormComponent, {
      data: {
        doctor,
        clinics: this.adminData.clinics,
      },
    });
  }

  chooseDoctorForEdit(doctor: IDoctor): void {
    const {
      doctor_id: id,
      speciality_id: specialityId,
      experience,
      information,
      active,
    } = doctor;

    this.doctorToAdd = {
      id,
      specialityId,
      experience,
      information,
      active,
    };
  }

  changeOrderStatus(order: IOrder): void {
    this.orderSerive.changeOrderStatus(order).subscribe(
      () => {
        order.status = +!order.status;
      },
      error => console.log(error),
    );
  }

  addSpeciality(): void {
    const {specialityName} = this;

    this.adminService.addSpeciality(specialityName).subscribe(
      speciality => {
        this.specialityName = '';
        this.addSpecialityError = '';
        this.adminData.specialities.push(speciality);
      },
      ({error}) => {
        this.addSpecialityError = error;
      },
    );
  }

  addOrChangeDoctor(): void {
    const {
      id,
      specialityId,
      experience,
      information,
      active,
    } = this.doctorToAdd;

    const fixedId = +id;
    const fixedSpecialityId = +specialityId;
    const fixedExperience = +experience;

    this.adminService
      .addOrUpdateDoctor(
        fixedId,
        fixedSpecialityId,
        fixedExperience,
        information,
        active,
      )
      .subscribe(
        result => {
          console.log(result);
          this.specialityName = '';
          this.addDoctorError = '';
        },
        ({error}) => {
          console.log(error);
          this.addDoctorError = error;
        },
      );
  }

  deleteSpeciality(specialityId: SpecialityId): void {
    this.adminService.deleteSpeciality(specialityId).subscribe(
      () => {
        this.adminData.specialities = this.adminData.specialities
          .filter(({id}) => id !== specialityId);
      },
      console.log,
    );
  }
}
