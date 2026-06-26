import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPatientMasterFormComponent } from './hospital-patient-master-form.component';

describe('HospitalPatientMasterFormComponent', () => {
  let component: HospitalPatientMasterFormComponent;
  let fixture: ComponentFixture<HospitalPatientMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPatientMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPatientMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
