import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {flatMap} from 'rxjs/operators';
import {ConsultationService} from '../services/consultation.service';
import {IConsultation, ConsultationId, IMessage} from '../models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private consultationService: ConsultationService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  private questionId: ConsultationId;
  private question: IConsultation;
  private messages: IMessage[] = [];

  private success = false;
  private error = '';

  private formModel = {
    message: '',
  };

  ngOnInit() {
    this.route.params.pipe(
      flatMap(params => {
        const {id} = params;
        this.questionId = id;
        return this.consultationService.getQuestion(id);
      }),
    ).subscribe(({question, messages}) => {
      this.question = question;
      this.messages = messages;
    });
  }

  addAnswer(): void {
    const {questionId, formModel} = this;

    this.consultationService.addAnswer(questionId, formModel.message).subscribe(
      message => {
        this.messages.push(message);
        this.formModel.message = '';
        this.changeDetector.detectChanges();
      },
      ({error}) => {
        this.error = error;
        this.changeDetector.detectChanges();
      },
    );
  }

  closeQuestion(): void {
    this.consultationService.closeQuestion(this.questionId).subscribe(
      () => {
        this.question.completed = true;
        this.changeDetector.detectChanges();
      },
      ({error}) => {
        this.error = error;
        this.changeDetector.detectChanges();
      },
    );
  }

}
