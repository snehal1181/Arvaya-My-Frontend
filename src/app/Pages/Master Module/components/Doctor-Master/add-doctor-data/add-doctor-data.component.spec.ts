import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorDataComponent } from './add-doctor-data.component';

describe('AddDoctorDataComponent', () => {
  let component: AddDoctorDataComponent;
  let fixture: ComponentFixture<AddDoctorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoctorDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
