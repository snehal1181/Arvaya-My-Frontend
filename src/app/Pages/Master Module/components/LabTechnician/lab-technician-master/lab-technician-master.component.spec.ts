import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTechnicianMasterComponent } from './lab-technician-master.component';

describe('LabTechnicianMasterComponent', () => {
  let component: LabTechnicianMasterComponent;
  let fixture: ComponentFixture<LabTechnicianMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabTechnicianMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTechnicianMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
