import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHospitalBillCatlogComponent } from './list-hospital-bill-catlog.component';

describe('ListHospitalBillCatlogComponent', () => {
  let component: ListHospitalBillCatlogComponent;
  let fixture: ComponentFixture<ListHospitalBillCatlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHospitalBillCatlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHospitalBillCatlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
