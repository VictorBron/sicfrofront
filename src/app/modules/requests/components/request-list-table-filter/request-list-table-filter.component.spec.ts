/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestListTableFilterComponent } from './request-list-table-filter.component';

describe('RequestListTableFilterComponent', () => {
  let component: RequestListTableFilterComponent;
  let fixture: ComponentFixture<RequestListTableFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestListTableFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestListTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
