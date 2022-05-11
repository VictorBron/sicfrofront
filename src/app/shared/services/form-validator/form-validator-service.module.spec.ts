/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormValidatorServiceModule } from './form-validator-service.module';

describe('Service: FormValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormValidatorServiceModule],
    });
  });

  it('should ...', inject([FormValidatorServiceModule], (service: FormValidatorServiceModule) => {
    expect(service).toBeTruthy();
  }));
});
