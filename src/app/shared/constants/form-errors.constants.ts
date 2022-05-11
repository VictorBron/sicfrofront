import { ValidationErrors } from '@angular/forms';

export enum FormErrorTextEnum {
  REQUIRED = 'VALIDATION.REQUIRED',
  PATTERN = 'VALIDATION.PATTERN',
  RUT = 'VALIDATION.RUT',
  RUT_FORMAT = 'VALIDATION.RUT_FORMAT',
  PATENT = 'VALIDATION.PATENT',
  EMAIL = 'VALIDATION.EMAIL',
  TIME_START = 'VALIDATION.TIME_START',
  TIME_END = 'VALIDATION.TIME_END',
  TIME = 'VALIDATION.TIME',
  END_DATE = 'VALIDATION.END_DATE',
  PASSWORD_SAME = 'VALIDATION.PASSWORD_SAME',
  EMPTY = 'VALIDATION.UNKNOWN',
}

export enum FormErrorsEnum {
  REQUIRED = 'required',
  PATTERN = 'pattern',
  RUT = 'rut',
  RUT_FORMAT = 'rutFormat',
  PATENT = 'patent',
  EMAIL = 'email',
  TIME_START = 'timeStart',
  TIME_END = 'timeEnd',
  TIME = 'time',
  END_DATE = 'matDatepickerMin',
  PASSWORD_SAME = 'passwordNotSame',
  EMPTY = '',
}

const getTextByErrorType = (errors: ValidationErrors): string => {
  if (errors[FormErrorsEnum.REQUIRED]) return FormErrorTextEnum.REQUIRED;
  else if (errors[FormErrorsEnum.PATTERN]) return FormErrorTextEnum.PATTERN;
  else if (errors[FormErrorsEnum.RUT]) return FormErrorTextEnum.RUT;
  else if (errors[FormErrorsEnum.RUT_FORMAT]) return FormErrorTextEnum.RUT_FORMAT;
  else if (errors[FormErrorsEnum.PATENT]) return FormErrorTextEnum.PATENT;
  else if (errors[FormErrorsEnum.EMAIL]) return FormErrorTextEnum.EMAIL;
  else if (errors[FormErrorsEnum.TIME]) return FormErrorTextEnum.TIME;
  else if (errors[FormErrorsEnum.TIME_START]) return FormErrorTextEnum.TIME_START;
  else if (errors[FormErrorsEnum.TIME_END]) return FormErrorTextEnum.TIME_END;
  else if (errors[FormErrorsEnum.END_DATE]) return FormErrorTextEnum.END_DATE;
  else if (errors[FormErrorsEnum.PASSWORD_SAME]) return FormErrorTextEnum.PASSWORD_SAME;
  return FormErrorTextEnum.EMPTY;
};

export const getTextByError = (validationErrors: ValidationErrors): string =>
  validationErrors ? getTextByErrorType(validationErrors) : '';
