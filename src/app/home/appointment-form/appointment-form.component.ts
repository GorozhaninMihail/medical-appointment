import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {IClinic, ClinicId} from 'src/app/models';
import {DoctorsService} from 'src/app/services/doctors.service';
import {AppointmentService} from 'src/app/services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<AppointmentFormComponent>,
    private doctorService: DoctorsService,
    private appointmentService: AppointmentService,
    private ref: ChangeDetectorRef,
  ) {}

  private doctor: any;
  private clinics: IClinic[];

  private timesheet = {};
  private minDate: Date;
  private maxDate: Date;
  private freeTime: string[];

  private success = false;
  private error = '';

  private formModel = {
    clinic: '',
    date: '',
    time: '',
    description: '',
  };

  ngOnInit() {
    const {doctor, clinics} = this.data;
    this.doctor = doctor;
    this.clinics = clinics;

    this.doctorService.getById(this.doctor.doctor_id)
      .subscribe(doctorInfo => {
        const {timesheet} = this;
        doctorInfo.timesheet.forEach(({mc_id, date, start}) => {
          if (!timesheet[mc_id]) {
            timesheet[mc_id] = {};
          }

          const dateToNumber = new Date(date).getTime();

          if (!timesheet[mc_id][dateToNumber]) {
            timesheet[mc_id][dateToNumber] = [];
          }

          timesheet[mc_id][dateToNumber].push(start);
        });
      });
  }

  closeForm(): void {
    this.bottomSheetRef.dismiss();
  }

  getClinicById(clinicId: ClinicId) {
    return this.clinics.find(clinic => clinicId === clinic.id);
  }

  clinicChanged() {
    const {formModel, timesheet} = this;
    const {clinic} = formModel;
    console.log('timesheet', timesheet[clinic]);
    const dates: number[] = Object.keys(timesheet[clinic])
      .map(key => Number(key));
    this.minDate = new Date(Math.min(...dates));
    this.maxDate = new Date(Math.max(...dates));
  }

  dateChanged() {
    const {formModel, timesheet} = this;
    const {clinic, date} = formModel;
    const dateToNumber = new Date(date).getTime();
    this.freeTime = timesheet[clinic][dateToNumber];
  }

  makeAppointment(): void {
    const {doctor_id: doctorId} = this.doctor;
    const {clinic: clinicId, date, description, time} = this.formModel;

    this.appointmentService.makeAppointment(
      Number(clinicId),
      doctorId,
      date,
      time,
      description,
    ).subscribe(
      () => {
        this.success = true;
        this.ref.detectChanges();
      },
      ({error}) => {
        this.error = error;
        this.ref.detectChanges();
      },
    );
  }

}
