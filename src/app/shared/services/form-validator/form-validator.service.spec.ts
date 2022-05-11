/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormValidatorService } from './form-validator.service';

describe('Service: FormValidator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormValidatorService],
    });
  });

  it('should ...', inject([FormValidatorService], (service: FormValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
