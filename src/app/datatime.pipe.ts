import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'datatime'
})
export class DatatimePipe implements PipeTransform {

    transform(value: any) {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
    }

}
