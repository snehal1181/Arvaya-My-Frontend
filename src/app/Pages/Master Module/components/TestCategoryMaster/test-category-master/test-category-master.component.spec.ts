import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCategoryMasterComponent } from './test-category-master.component';

describe('TestCategoryMasterComponent', () => {
  let component: TestCategoryMasterComponent;
  let fixture: ComponentFixture<TestCategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCategoryMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
