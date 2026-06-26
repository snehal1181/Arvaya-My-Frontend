import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBillCatalogueMasterComponent } from './hospital-bill-catalogue-master.component';

describe('HospitalBillCatalogueMasterComponent', () => {
  let component: HospitalBillCatalogueMasterComponent;
  let fixture: ComponentFixture<HospitalBillCatalogueMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalBillCatalogueMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalBillCatalogueMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
