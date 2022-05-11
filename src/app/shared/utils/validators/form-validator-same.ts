import { FormGroup } from '@angular/forms';

export const validatorCheckSamePassword = (item1Key: string, item2Key: string) => {
  return (group: FormGroup) => {
    let itemInput = group.controls[item1Key],
      itemConfirmationInput = group.controls[item2Key];
    if (itemInput.value !== itemConfirmationInput.value) {
      return itemConfirmationInput.setErrors({ ...itemConfirmationInput.errors, passwordNotSame: true });
    } else {
      return itemConfirmationInput.setErrors(null);
    }
  };
};
