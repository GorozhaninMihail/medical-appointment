import {Pipe, PipeTransform} from '@angular/core';
import {IDoctor} from '../models';

@Pipe({
  name: 'userFio',
})
export class UserFioPipe implements PipeTransform {
  transform(doctor: IDoctor): string {
    const {last_name, first_name, middle_name} = doctor;

    let result = `${last_name} ${first_name[0]}.`;

    if (middle_name) {
      result += ` ${middle_name[0]}.`;
    }

    return result;
  }
}
