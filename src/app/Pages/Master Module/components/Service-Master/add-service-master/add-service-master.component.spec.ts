import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceMAsterComponent } from './add-service-master.component';

describe('AddServiceMAsterComponent', () => {
  let component: AddServiceMAsterComponent;
  let fixture: ComponentFixture<AddServiceMAsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceMAsterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceMAsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
