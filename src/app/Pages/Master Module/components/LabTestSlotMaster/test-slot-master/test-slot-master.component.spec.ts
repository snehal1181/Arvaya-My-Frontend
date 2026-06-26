import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSlotMasterComponent } from './test-slot-master.component';

describe('TestSlotMasterComponent', () => {
  let component: TestSlotMasterComponent;
  let fixture: ComponentFixture<TestSlotMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSlotMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSlotMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
