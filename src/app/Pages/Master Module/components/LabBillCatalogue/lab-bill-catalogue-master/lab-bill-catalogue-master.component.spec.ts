import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBillCatalogueMasterComponent } from './lab-bill-catalogue-master.component';

describe('LabBillCatalogueMasterComponent', () => {
  let component: LabBillCatalogueMasterComponent;
  let fixture: ComponentFixture<LabBillCatalogueMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabBillCatalogueMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabBillCatalogueMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
