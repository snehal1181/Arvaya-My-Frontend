import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthrecordsformComponent } from './healthrecordsform.component';

describe('HealthrecordsformComponent', () => {
  let component: HealthrecordsformComponent;
  let fixture: ComponentFixture<HealthrecordsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthrecordsformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthrecordsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
