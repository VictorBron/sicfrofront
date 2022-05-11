/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationServiceModule } from './notification-service.module';

describe('Service: NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationServiceModule],
    });
  });

  it('should ...', inject([NotificationServiceModule], (service: NotificationServiceModule) => {
    expect(service).toBeTruthy();
  }));
});
