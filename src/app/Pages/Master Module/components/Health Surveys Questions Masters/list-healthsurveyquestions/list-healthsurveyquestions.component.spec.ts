import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHealthsurveyquestionsComponent } from './list-healthsurveyquestions.component';

describe('ListHealthsurveyquestionsComponent', () => {
  let component: ListHealthsurveyquestionsComponent;
  let fixture: ComponentFixture<ListHealthsurveyquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHealthsurveyquestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHealthsurveyquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
