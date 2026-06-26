import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBillMasterComponent } from './hospital-bill-master.component';

describe('HospitalBillMasterComponent', () => {
  let component: HospitalBillMasterComponent;
  let fixture: ComponentFixture<HospitalBillMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalBillMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalBillMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
