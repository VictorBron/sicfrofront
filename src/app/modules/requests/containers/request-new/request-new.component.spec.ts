/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestNewComponent } from './request-new.component';

describe('RequestNewComponent', () => {
  let component: RequestNewComponent;
  let fixture: ComponentFixture<RequestNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
