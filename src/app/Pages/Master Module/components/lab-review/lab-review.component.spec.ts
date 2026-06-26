import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReviewComponent } from './lab-review.component';

describe('LabReviewComponent', () => {
  let component: LabReviewComponent;
  let fixture: ComponentFixture<LabReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
