import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabAppointmentComponent2 } from './add-lab-appointment2.component';

describe('AddLabAppointmentComponent', () => {
  let component: AddLabAppointmentComponent2;
  let fixture: ComponentFixture<AddLabAppointmentComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabAppointmentComponent2 ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabAppointmentComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
