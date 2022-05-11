/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DriverDataComponent } from './driver-data.component';

describe('DriverDataComponent', () => {
  let component: DriverDataComponent;
  let fixture: ComponentFixture<DriverDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
