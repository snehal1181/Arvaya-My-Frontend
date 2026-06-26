import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMasterFormComponent } from './test-master-form.component';

describe('TestMasterFormComponent', () => {
  let component: TestMasterFormComponent;
  let fixture: ComponentFixture<TestMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
