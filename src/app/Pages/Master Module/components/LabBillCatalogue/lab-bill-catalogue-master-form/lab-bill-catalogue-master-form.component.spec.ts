import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBillCatalogueMasterFormComponent } from './lab-bill-catalogue-master-form.component';

describe('LabBillCatalogueMasterFormComponent', () => {
  let component: LabBillCatalogueMasterFormComponent;
  let fixture: ComponentFixture<LabBillCatalogueMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabBillCatalogueMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabBillCatalogueMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
