import { Pipe, PipeTransform } from '@angular/core';

const NBSP = '\u00a0';

/** 15 -> "15", 13.5 -> "13,5" (French decimal comma). */
@Pipe({ name: 'grade' })
export class GradePipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  }
}

/**
 * 8000 -> "8 000 DA" (Algerian dinars, non-breaking spaces).
 * Use `dzd: false` to get the number alone when the unit is styled separately.
 */
@Pipe({ name: 'dzd' })
export class DzdPipe implements PipeTransform {
  transform(value: number, withUnit = true): string {
    const amount = value.toLocaleString('fr-FR', { maximumFractionDigits: 0 }).replace(/\s/g, NBSP);
    return withUnit ? `${amount}${NBSP}DA` : amount;
  }
}
