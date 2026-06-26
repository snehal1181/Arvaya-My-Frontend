import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSymptonsComponent } from './add-symptons.component';

describe('AddSymptonsComponent', () => {
  let component: AddSymptonsComponent;
  let fixture: ComponentFixture<AddSymptonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSymptonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSymptonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
