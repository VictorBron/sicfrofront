/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableRelationsComponent } from './table-relations.component';

describe('TableRelationsComponent', () => {
  let component: TableRelationsComponent;
  let fixture: ComponentFixture<TableRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableRelationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
