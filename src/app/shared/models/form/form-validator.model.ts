import { FormGroup } from '@angular/forms';
export interface IFormValidator {
  id?: string;
  formGroup?: FormGroup;
  response?: boolean;
  haveErrors?: boolean;
  notDisabled?: boolean;
}
