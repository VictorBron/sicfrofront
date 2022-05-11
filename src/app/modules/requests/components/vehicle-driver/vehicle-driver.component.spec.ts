/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VehicleDriverComponent } from './vehicle-driver.component';

describe('VehicleDriverComponent', () => {
  let component: VehicleDriverComponent;
  let fixture: ComponentFixture<VehicleDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDriverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
