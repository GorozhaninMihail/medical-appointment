import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {ISpeciality, IDoctor} from 'src/app/models';
import {ConsultationService} from 'src/app/services/consultation.service';

@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.scss'],
})
export class ConsultationFormComponent implements OnInit {

  private speciality: ISpeciality;
  private doctor?: IDoctor;

  private success = false;
  private error = '';

  private formModel = {
    title: '',
    message: '',
  };

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      speciality: ISpeciality,
      doctor?: IDoctor,
    },
    private bottomSheetRef: MatBottomSheetRef<ConsultationFormComponent>,
    private consultationService: ConsultationService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const {speciality, doctor} = this.data;

    if (speciality) {
      this.speciality = speciality;
    }

    if (doctor) {
      this.doctor = doctor;
    }
  }

  closeForm(): void {
    this.bottomSheetRef.dismiss();
  }

  addNewQuestion(): void {
    const {doctor, speciality, formModel} = this;

    const doctorId = doctor
      ? doctor.doctor_id
      : 0;
    const specialityId = speciality.id;

    const {title, message} = formModel;

    this.consultationService.addQuestion(
      doctorId,
      specialityId,
      title,
      message,
    ).subscribe(
      () => {
        this.success = true;
        this.changeDetector.detectChanges();
      },
      ({error}) => {
        this.error = error;
        this.changeDetector.detectChanges();
      },
    );
  }
}
