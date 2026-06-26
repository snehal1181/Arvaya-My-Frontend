import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestMappingComponent } from './add-test-mapping.component';

describe('AddTestMappingComponent', () => {
  let component: AddTestMappingComponent;
  let fixture: ComponentFixture<AddTestMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTestMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTestMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
