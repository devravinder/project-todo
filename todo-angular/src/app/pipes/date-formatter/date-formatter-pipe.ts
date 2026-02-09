import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../util/constants';

@Pipe({
  name: 'dateFormatter',
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: string | Date | null | undefined, format: string = DATE_FORMAT): string {
     if (!value) return '';

    return dayjs(value).format(format);
  }

}
