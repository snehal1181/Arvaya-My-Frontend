import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasterfamilyaddComponent } from './patientmasterfamilyadd.component';

describe('PatientmasterfamilyaddComponent', () => {
  let component: PatientmasterfamilyaddComponent;
  let fixture: ComponentFixture<PatientmasterfamilyaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasterfamilyaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasterfamilyaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
