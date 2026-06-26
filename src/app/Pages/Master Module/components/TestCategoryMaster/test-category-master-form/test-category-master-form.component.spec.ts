import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCategoryMasterFormComponent } from './test-category-master-form.component';

describe('TestCategoryMasterFormComponent', () => {
  let component: TestCategoryMasterFormComponent;
  let fixture: ComponentFixture<TestCategoryMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCategoryMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCategoryMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
