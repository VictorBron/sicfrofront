import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLoadingComponent } from './general-loading.component';

describe('GeneralLoadingComponent', () => {
  let component: GeneralLoadingComponent;
  let fixture: ComponentFixture<GeneralLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralLoadingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
