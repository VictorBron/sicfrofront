/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestUploadFileComponent } from './upload-file.component';

describe('RequestUploadFileComponent', () => {
  let component: RequestUploadFileComponent;
  let fixture: ComponentFixture<RequestUploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestUploadFileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
