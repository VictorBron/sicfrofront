import { AbstractControl, FormGroup } from '@angular/forms';

export const validatorHourStart = (hourStartKey: string, hourEndKey: string) => {
  return (group: FormGroup) => {
    let hourStartAbstract: AbstractControl = group.controls[hourStartKey];
    const timeStart: string[] = hourStartAbstract.value.split(':');

    let hourEndAbstract: AbstractControl = group.controls[hourEndKey];
    const timeEnd: string[] = hourEndAbstract.value.split(':');

    let dateStart: Date = new Date();
    dateStart.setHours(Number(timeStart[0]), Number(timeStart[1]), 0);

    let dateEnd: Date = new Date();
    dateEnd.setHours(Number(timeEnd[0]), Number(timeEnd[1]), 0);

    if (dateStart >= dateEnd) return hourEndAbstract.setErrors({ timeStart: true });
    else return hourEndAbstract.setErrors(null);
  };
};

export const validatorHourEnd = (hourStartKey: string, hourEndKey: string) => {
  return (group: FormGroup) => {
    let hourStartAbstract: AbstractControl = group.get(hourStartKey);
    const timeStart: string[] = hourStartAbstract.value.split(':');

    let hourEndAbstract: AbstractControl = group.get(hourEndKey);
    const timeEnd: string[] = hourEndAbstract.value.split(':');

    let dateStart: Date = new Date();
    dateStart.setHours(Number(timeStart[0]), Number(timeStart[1]), 0);

    let dateEnd: Date = new Date();
    dateEnd.setHours(Number(timeEnd[0]), Number(timeEnd[1]), 0);

    if (dateEnd <= dateStart) return hourEndAbstract.setErrors({ timeEnd: true });
    else return hourEndAbstract.setErrors(null);
  };
};

export const validatorHour = (validityStartKey: string, hourEndKey: string) => {
  return (group: FormGroup) => {
    let now: Date = new Date();

    let validityStartAbstract: AbstractControl = group.get(validityStartKey);
    const validityStartValue: Date = validityStartAbstract.value;
    validityStartValue.setHours(0, 0, 0);

    let hourEndAbstract: AbstractControl = group.get(hourEndKey);
    const timeEnd: string[] = hourEndAbstract.value.split(':');

    let dateEnd: Date = new Date();
    dateEnd.setHours(Number(timeEnd[0]), Number(timeEnd[1]), 0);
    if (
      validityStartValue.getDate() === now.getDate() &&
      validityStartValue.getMonth() === now.getMonth() &&
      validityStartValue.getFullYear() === now.getFullYear()
    ) {
      if (dateEnd <= now) return hourEndAbstract.setErrors({ time: true });
    } else return hourEndAbstract.setErrors(null);
  };
};
