import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasteraddresslistComponent } from './patientmasteraddresslist.component';

describe('PatientmasteraddresslistComponent', () => {
  let component: PatientmasteraddresslistComponent;
  let fixture: ComponentFixture<PatientmasteraddresslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasteraddresslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasteraddresslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
