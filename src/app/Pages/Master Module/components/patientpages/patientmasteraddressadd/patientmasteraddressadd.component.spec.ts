import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmasteraddressaddComponent } from './patientmasteraddressadd.component';

describe('PatientmasteraddressaddComponent', () => {
  let component: PatientmasteraddressaddComponent;
  let fixture: ComponentFixture<PatientmasteraddressaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientmasteraddressaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmasteraddressaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
