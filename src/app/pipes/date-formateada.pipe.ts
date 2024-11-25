import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormateada',
  standalone: true
})
export class DateFormateadaPipe implements PipeTransform {
  transform(value: Date): string {
    const ano = value.getFullYear();
    const mes = (value.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    const dia = value.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos

    return `${ano}-${mes}-${dia}`;
  }
}
