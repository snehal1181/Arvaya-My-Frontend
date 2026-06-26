import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPatientMasterComponent } from './lab-patient-master.component';

describe('LabPatientMasterComponent', () => {
  let component: LabPatientMasterComponent;
  let fixture: ComponentFixture<LabPatientMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPatientMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPatientMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
