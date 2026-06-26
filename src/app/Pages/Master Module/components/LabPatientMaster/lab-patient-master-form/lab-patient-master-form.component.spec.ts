import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPatientMasterFormComponent } from './lab-patient-master-form.component';

describe('LabPatientMasterFormComponent', () => {
  let component: LabPatientMasterFormComponent;
  let fixture: ComponentFixture<LabPatientMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPatientMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPatientMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
