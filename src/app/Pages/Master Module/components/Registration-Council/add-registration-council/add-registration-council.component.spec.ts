import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistrationCouncilComponent } from './add-registration-council.component';

describe('AddRegistrationCouncilComponent', () => {
  let component: AddRegistrationCouncilComponent;
  let fixture: ComponentFixture<AddRegistrationCouncilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegistrationCouncilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRegistrationCouncilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
