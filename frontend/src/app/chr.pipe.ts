import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chr',
  standalone: true
})
export class ChrPipe implements PipeTransform {
  transform(value: number): string {
    return String.fromCharCode(value);
  }
}
