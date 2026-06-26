import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasterlistComponent } from './patientmasterlist.component';

describe('PatientmasterlistComponent', () => {
  let component: PatientmasterlistComponent;
  let fixture: ComponentFixture<PatientmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
