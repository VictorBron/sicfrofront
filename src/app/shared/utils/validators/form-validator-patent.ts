import { AbstractControl, FormGroup } from '@angular/forms';

const reggexExp_after2007 = /^[a-zA-Z]{4}[0-9]{2}$/;
const reggexExp_before2007 = /^[a-zA-Z]{2}[0-9]{4}$/;

export const validatorCheckPatent = (patentKey: string) => {
  return (group: FormGroup) => {
    let patentAbstract: AbstractControl = group.controls[patentKey];
    const patent: string = patentAbstract.value as string;
    if (!patent || patent.length !== 6 || !isPatentOk(patent))
      return patentAbstract.setErrors({ ...patentAbstract.errors, patent: true });
    return null;
  };
};

export const isPatentOk = (patent: string): boolean => {
  if (!patent) return false;
  return reggexExp_after2007.test(patent) || reggexExp_before2007.test(patent);
};
