/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExpireSessionService } from './expire-session.service';

describe('Service: ExpireSession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpireSessionService],
    });
  });

  it('should ...', inject([ExpireSessionService], (service: ExpireSessionService) => {
    expect(service).toBeTruthy();
  }));
});
