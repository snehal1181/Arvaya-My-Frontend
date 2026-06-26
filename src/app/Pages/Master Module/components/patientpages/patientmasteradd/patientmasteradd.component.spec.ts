import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasteraddComponent } from './patientmasteradd.component';

describe('PatientmasteraddComponent', () => {
  let component: PatientmasteraddComponent;
  let fixture: ComponentFixture<PatientmasteraddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasteraddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasteraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
