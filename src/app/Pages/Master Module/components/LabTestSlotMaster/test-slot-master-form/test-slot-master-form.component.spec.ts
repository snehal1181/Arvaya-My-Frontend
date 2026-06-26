import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSlotMasterFormComponent } from './test-slot-master-form.component';

describe('TestSlotMasterFormComponent', () => {
  let component: TestSlotMasterFormComponent;
  let fixture: ComponentFixture<TestSlotMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSlotMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSlotMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
