import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHolidayMasterComponent } from './list-holiday-master.component';

describe('ListHolidayMasterComponent', () => {
  let component: ListHolidayMasterComponent;
  let fixture: ComponentFixture<ListHolidayMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHolidayMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHolidayMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
