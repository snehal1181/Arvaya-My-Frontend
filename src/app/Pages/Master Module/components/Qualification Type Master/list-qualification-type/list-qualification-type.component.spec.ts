import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQualificationTypeComponent } from './list-qualification-type.component';

describe('ListQualificationTypeComponent', () => {
  let component: ListQualificationTypeComponent;
  let fixture: ComponentFixture<ListQualificationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListQualificationTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListQualificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
