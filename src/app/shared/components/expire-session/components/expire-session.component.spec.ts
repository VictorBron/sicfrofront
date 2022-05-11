/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExpireSessionComponent } from './expire-session.component';

describe('ExpireSessionComponent', () => {
  let component: ExpireSessionComponent;
  let fixture: ComponentFixture<ExpireSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpireSessionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpireSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
