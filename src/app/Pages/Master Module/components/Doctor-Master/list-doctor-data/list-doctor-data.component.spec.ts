import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDoctorDataComponent } from './list-doctor-data.component';

describe('ListDoctorDataComponent', () => {
  let component: ListDoctorDataComponent;
  let fixture: ComponentFixture<ListDoctorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDoctorDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDoctorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
