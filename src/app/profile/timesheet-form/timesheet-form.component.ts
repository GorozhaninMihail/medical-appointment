import {Component, Inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {IDoctor, IClinic} from 'src/app/models';
import {AdminService} from 'src/app/services/admin.service';

@Component({
  selector: 'app-timesheet-form',
  templateUrl: './timesheet-form.component.html',
  styleUrls: ['./timesheet-form.component.scss'],
})
export class TimesheetFormComponent implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      doctor: IDoctor,
      clinics: IClinic[],
    },
    private bottomSheetRef: MatBottomSheetRef<TimesheetFormComponent>,
    private adminService: AdminService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  private doctor: any;
  private clinics: IClinic[];

  private currentDate = new Date();

  // Form
  private error: string;
  private result: string;
  private formModel = {
    clinic: '',
    date: '',
    time: '',
  };

  ngOnInit() {
    const {doctor, clinics} = this.data;
    this.doctor = doctor;
    this.clinics = clinics;
  }

  addNewRecord(): void {
    const {clinic: clinicId, date, time} = this.formModel;
    const {doctor_id: doctorId} = this.doctor;

    this.adminService.addTimesheetRecord(
      doctorId,
      +clinicId,
      new Date(date),
      time,
    ).subscribe(
      result => {
        this.result = result;
        this.error = '';
        this.formModel = {
          clinic: '',
          date: '',
          time: '',
        };
        this.changeDetector.detectChanges();
      },
      ({error}) => {
        this.error = error;
        this.changeDetector.detectChanges();
      },
    );
  }

  closeForm(): void {
    this.bottomSheetRef.dismiss();
  }
}
