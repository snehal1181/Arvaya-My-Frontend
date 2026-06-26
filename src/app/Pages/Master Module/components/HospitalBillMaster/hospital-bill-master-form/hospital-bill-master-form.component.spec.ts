import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalBillMasterFormComponent } from './hospital-bill-master-form.component';

describe('HospitalBillMasterFormComponent', () => {
  let component: HospitalBillMasterFormComponent;
  let fixture: ComponentFixture<HospitalBillMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalBillMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalBillMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
