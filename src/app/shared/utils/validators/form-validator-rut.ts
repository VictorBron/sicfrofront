import { AbstractControl, FormGroup } from '@angular/forms';

export const validatorCheckRUT = (rutKey: string) => {
  return (group: FormGroup) => {
    let rutAbstract: AbstractControl = group.controls[rutKey];

    const value: string = rutAbstract.value;
    if (!value || !value.includes('-')) return rutAbstract.setErrors({ ...rutAbstract.errors, rutFormat: true });

    const rut: string[] = rutAbstract.value.split('-');

    if (!rut[1] || !isRUTOk(Number(rut[0]), rut[1].toUpperCase()))
      return rutAbstract.setErrors({ ...rutAbstract.errors, rut: true });
    return null;
  };
};

export const isRUTOk = (rutNumber: number, validationControl: string): boolean => {
  if (!rutNumber || !validationControl) return false;
  if (Number.isNaN(rutNumber) || validationControl.length !== 1) return false;

  let counter: number = 0,
    i: number = 2,
    divider: any = 0;

  while (rutNumber !== 0) {
    counter += (rutNumber % 10) * i;
    rutNumber = Math.floor(rutNumber / 10);
    i = i < 7 ? i + 1 : 2;
  }

  divider = 11 - (counter % 11);

  divider = divider === 10 ? 'K' : divider;
  divider = divider === 11 ? '0' : divider;

  if (String(divider) === String(validationControl)) return true;
  else return false;
};
