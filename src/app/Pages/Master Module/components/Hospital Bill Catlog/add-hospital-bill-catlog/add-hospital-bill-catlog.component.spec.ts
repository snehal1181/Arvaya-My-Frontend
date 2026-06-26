import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalBillCatlogComponent } from './add-hospital-bill-catlog.component';

describe('AddHospitalBillCatlogComponent', () => {
  let component: AddHospitalBillCatlogComponent;
  let fixture: ComponentFixture<AddHospitalBillCatlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHospitalBillCatlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHospitalBillCatlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
