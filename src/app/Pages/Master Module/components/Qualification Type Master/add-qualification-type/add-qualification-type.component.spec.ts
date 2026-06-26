import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQualificationTypeComponent } from './add-qualification-type.component';

describe('AddQualificationTypeComponent', () => {
  let component: AddQualificationTypeComponent;
  let fixture: ComponentFixture<AddQualificationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQualificationTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQualificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
