import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlabComponent } from './addlab.component';

describe('AddlabComponent', () => {
  let component: AddlabComponent;
  let fixture: ComponentFixture<AddlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddlabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
