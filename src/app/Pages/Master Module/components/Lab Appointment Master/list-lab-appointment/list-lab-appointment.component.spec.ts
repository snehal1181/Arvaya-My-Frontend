import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLabAppointmentComponent } from './list-lab-appointment.component';

describe('ListLabAppointmentComponent', () => {
  let component: ListLabAppointmentComponent;
  let fixture: ComponentFixture<ListLabAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLabAppointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLabAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
