import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {ProfileService} from '../services/profile.service';
import {IOrder, IUser, IConsultation, IDoctor} from '../models';
import {ConsultationService} from '../services/consultation.service';
import {DoctorsService} from '../services/doctors.service';
import {flatMap, filter} from 'rxjs/operators';
import {OrderService} from '../services/order.service';
import {AdminService} from '../services/admin.service';

enum Tabs {
  Orders = 0,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    private consultationService: ConsultationService,
    private doctorService: DoctorsService,
    private orderSerive: OrderService,
    private adminService: AdminService,
  ) {}

  private selectedTab: Tabs = Tabs.Orders;
  private user: IUser;

  private orders: IOrder[];
  private consultations: IConsultation[];
  private doctors: IDoctor[];
  private stats: any;

  private loaded = false;
  private specialityName = '';
  private error = '';

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

        let requests = [
          this.orderSerive.getOrders(),
          this.consultationService.getAll(),
          this.doctorService.getAll(),
        ];

        if (user.role === 'admin') {
          requests.push(this.adminService.getStats());
        }
        return forkJoin(...requests);
      }),
    ).subscribe(([orders, consultations, doctors, stats]) => {
      this.orders = orders;
      this.consultations = consultations;
      this.doctors = doctors;
      this.stats = stats;
      this.loaded = true;
    });
  }

  setTab(tabIndex: Tabs): void {
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

    let subject: string;

    if (doctor_id) {
      const {first_name, middle_name, last_name} = doctorInfo;
      subject = `${last_name} ${first_name[0]}. ${middle_name[0]}. (${speciality})`;
    } else {
      subject = `${speciality} (любой врач)`;
    }

    return subject;
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
      () => {
        this.specialityName = '';
        this.error = '';
      },
      ({error}) => {
        this.error = error;
      },
    );
  }
}
