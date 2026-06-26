import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineTypeMasterComponent } from './medicine-type-master.component';

describe('MedicineTypeMasterComponent', () => {
  let component: MedicineTypeMasterComponent;
  let fixture: ComponentFixture<MedicineTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineTypeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
