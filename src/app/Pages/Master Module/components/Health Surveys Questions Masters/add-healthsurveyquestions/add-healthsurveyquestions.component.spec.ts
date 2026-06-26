import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthsurveyquestionsComponent } from './add-healthsurveyquestions.component';

describe('AddHealthsurveyquestionsComponent', () => {
  let component: AddHealthsurveyquestionsComponent;
  let fixture: ComponentFixture<AddHealthsurveyquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHealthsurveyquestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHealthsurveyquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
