import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRegistrationCouncilComponent } from './list-registration-council.component';

describe('ListRegistrationCouncilComponent', () => {
  let component: ListRegistrationCouncilComponent;
  let fixture: ComponentFixture<ListRegistrationCouncilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRegistrationCouncilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRegistrationCouncilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
