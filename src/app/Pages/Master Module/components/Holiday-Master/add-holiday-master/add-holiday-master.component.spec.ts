import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHolidayMasterComponent } from './add-holiday-master.component';

describe('AddHolidayMasterComponent', () => {
  let component: AddHolidayMasterComponent;
  let fixture: ComponentFixture<AddHolidayMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHolidayMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHolidayMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
