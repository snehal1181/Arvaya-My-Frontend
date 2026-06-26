import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalClinicMasterFormComponent } from './hospital-clinic-master-form.component';

describe('HospitalClinicMasterFormComponent', () => {
  let component: HospitalClinicMasterFormComponent;
  let fixture: ComponentFixture<HospitalClinicMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalClinicMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalClinicMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
