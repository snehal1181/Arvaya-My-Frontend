import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineTypeMasterFormComponent } from './medicine-type-master-form.component';

describe('MedicineTypeMasterFormComponent', () => {
  let component: MedicineTypeMasterFormComponent;
  let fixture: ComponentFixture<MedicineTypeMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineTypeMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineTypeMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
