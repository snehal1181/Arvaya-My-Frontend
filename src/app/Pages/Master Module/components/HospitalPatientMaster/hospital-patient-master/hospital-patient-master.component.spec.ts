import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPatientMasterComponent } from './hospital-patient-master.component';

describe('HospitalPatientMasterComponent', () => {
  let component: HospitalPatientMasterComponent;
  let fixture: ComponentFixture<HospitalPatientMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPatientMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPatientMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
