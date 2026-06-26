import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBillCatalogueMasterFormComponent } from './hospital-bill-catalogue-master-form.component';

describe('HospitalBillCatalogueMasterFormComponent', () => {
  let component: HospitalBillCatalogueMasterFormComponent;
  let fixture: ComponentFixture<HospitalBillCatalogueMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalBillCatalogueMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalBillCatalogueMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
