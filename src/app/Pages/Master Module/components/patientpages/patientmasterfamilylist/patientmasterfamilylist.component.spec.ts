import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasterfamilylistComponent } from './patientmasterfamilylist.component';

describe('PatientmasterfamilylistComponent', () => {
  let component: PatientmasterfamilylistComponent;
  let fixture: ComponentFixture<PatientmasterfamilylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasterfamilylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasterfamilylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
