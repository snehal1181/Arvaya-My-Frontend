import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalClinicMasterComponent } from './hospital-clinic-master.component';

describe('HospitalClinicMasterComponent', () => {
  let component: HospitalClinicMasterComponent;
  let fixture: ComponentFixture<HospitalClinicMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalClinicMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalClinicMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
