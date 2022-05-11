/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalExpireSessionComponent } from './modal-expire-session.component';

describe('ModalExpireSessionComponent', () => {
  let component: ModalExpireSessionComponent;
  let fixture: ComponentFixture<ModalExpireSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalExpireSessionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExpireSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
