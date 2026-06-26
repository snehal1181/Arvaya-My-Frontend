import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicianMasterFormComponent } from './lab-technician-master-form.component';

describe('LabTechnicianMasterFormComponent', () => {
  let component: LabTechnicianMasterFormComponent;
  let fixture: ComponentFixture<LabTechnicianMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabTechnicianMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTechnicianMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
