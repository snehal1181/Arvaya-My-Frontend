import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppointmentTableComponent } from './lab-appointment-table.component';

describe('LabAppointmentTableComponent', () => {
  let component: LabAppointmentTableComponent;
  let fixture: ComponentFixture<LabAppointmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabAppointmentTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabAppointmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
